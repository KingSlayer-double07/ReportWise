import { execSync } from "child_process";
import * as bcrypt from "bcrypt";
import { randomBytes, randomUUID } from "crypto";
import * as dotenv from "dotenv";
import { Client } from "pg";
import * as path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const ALLOWED_PLAN_TIERS = [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "ENTERPRISE",
  "COMPLIMENTARY",
] as const;

type PlanTier = (typeof ALLOWED_PLAN_TIERS)[number];

interface ProvisionSchoolInput {
  name: string;
  slug: string;
  adminEmail: string;
  planTier: PlanTier;
  adminFirstName: string;
  adminLastName: string;
}

interface GradeBand {
  min: number;
  max: number;
  grade: string;
  remark: string;
}

const DEFAULT_GRADE_BANDS: GradeBand[] = [
  { min: 70, max: 100, grade: "A", remark: "Excellent" },
  { min: 60, max: 69, grade: "B", remark: "Very Good" },
  { min: 50, max: 59, grade: "C", remark: "Good" },
  { min: 45, max: 49, grade: "D", remark: "Fair" },
  { min: 40, max: 44, grade: "E", remark: "Pass" },
  { min: 0, max: 39, grade: "F", remark: "Fail" },
];

const DEFAULT_ADMIN_FIRST_NAME = "School";
const DEFAULT_ADMIN_LAST_NAME = "Admin";
const PASSWORD_SALT_ROUNDS = 12;

/**
 * Manual school provisioning flow for Super Admin use.
 *
 * This script:
 * 1. validates the requested school metadata
 * 2. checks that the school does not already exist in public."School"
 * 3. provisions and migrates the tenant schema
 * 4. creates the school record in the public schema
 *
 * Usage:
 *   npx ts-node scripts/provision-school.ts \
 *     --name "Greenfield Academy" \
 *     --slug greenfield \
 *     --admin-email admin@greenfield.edu.ng \
 *     --admin-first-name School \
 *     --admin-last-name Admin \
 *     --plan-tier SMALL
 */

function parseArgs(argv: string[]): ProvisionSchoolInput {
  const args = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (!current.startsWith("--")) {
      continue;
    }

    if (!next || next.startsWith("--")) {
      throw new Error(`Missing value for argument ${current}`);
    }

    args.set(current, next.trim());
    index += 1;
  }

  const name = args.get("--name") ?? "";
  const slug = args.get("--slug") ?? "";
  const adminEmail = args.get("--admin-email") ?? "";
  const adminFirstName =
    args.get("--admin-first-name") ?? DEFAULT_ADMIN_FIRST_NAME;
  const adminLastName =
    args.get("--admin-last-name") ?? DEFAULT_ADMIN_LAST_NAME;
  const planTierRaw = (args.get("--plan-tier") ?? "SMALL").toUpperCase();

  if (!name) {
    throw new Error("School name is required. Pass --name \"School Name\"");
  }

  if (!slug) {
    throw new Error("School slug is required. Pass --slug school_slug");
  }

  if (!adminEmail) {
    throw new Error(
      "Admin email is required. Pass --admin-email admin@example.com",
    );
  }

  if (!/^[a-z0-9_]+$/.test(slug)) {
    throw new Error(
      "School slug must contain only lowercase letters, numbers, and underscores",
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
    throw new Error("Admin email must be a valid email address");
  }

  if (!ALLOWED_PLAN_TIERS.includes(planTierRaw as PlanTier)) {
    throw new Error(
      `Invalid plan tier "${planTierRaw}". Allowed values: ${ALLOWED_PLAN_TIERS.join(", ")}`,
    );
  }

  return {
    name,
    slug,
    adminEmail: adminEmail.toLowerCase(),
    adminFirstName: adminFirstName.trim() || DEFAULT_ADMIN_FIRST_NAME,
    adminLastName: adminLastName.trim() || DEFAULT_ADMIN_LAST_NAME,
    planTier: planTierRaw as PlanTier,
  };
}

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL or DIRECT_URL must be set before provisioning a school",
    );
  }

  return databaseUrl;
}

async function assertSchoolDoesNotExist(
  client: Client,
  input: ProvisionSchoolInput,
): Promise<void> {
  const existing = await client.query(
    `
      SELECT id, slug, "adminEmail"
      FROM public."School"
      WHERE slug = $1 OR "adminEmail" = $2
      LIMIT 1
    `,
    [input.slug, input.adminEmail],
  );

  if (existing.rowCount && existing.rows[0]) {
    const row = existing.rows[0];

    if (row.slug === input.slug) {
      throw new Error(`A school with slug "${input.slug}" already exists`);
    }

    if (row.adminEmail === input.adminEmail) {
      throw new Error(
        `A school with admin email "${input.adminEmail}" already exists`,
      );
    }
  }
}

async function createSchoolRecord(
  client: Client,
  input: ProvisionSchoolInput,
): Promise<void> {
  const schemaName = `school_${input.slug}`;

  await client.query(
    `
      INSERT INTO public."School"
        ("id", "name", "slug", "status", "planTier", "adminEmail", "schemaName", "updatedAt", "lastActiveAt")
      VALUES
        ($1, $2, $3, 'TRIAL', $4, $5, $6, now(), now())
    `,
    [
      randomUUID(),
      input.name,
      input.slug,
      input.planTier,
      input.adminEmail,
      schemaName,
    ],
  );
}

function generateTemporaryPassword(): string {
  return `RW-${randomBytes(9).toString("base64url")}`;
}

async function createSchoolAdminAccount(
  client: Client,
  input: ProvisionSchoolInput,
): Promise<{ status: "created"; temporaryPassword: string } | { status: "skipped" }> {
  const schemaName = `school_${input.slug}`;
  const existing = await client.query(
    `
      SELECT u.id
      FROM "${schemaName}"."User" u
      WHERE u.email = $1
      LIMIT 1
    `,
    [input.adminEmail],
  );

  if (existing.rowCount && existing.rows[0]) {
    return { status: "skipped" };
  }

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(
    temporaryPassword,
    PASSWORD_SALT_ROUNDS,
  );
  const userId = randomUUID();
  const adminId = randomUUID();

  await client.query(
    `
      INSERT INTO "${schemaName}"."User"
        ("id", "role", "email", "password", "mustChangePassword", "updatedAt")
      VALUES
        ($1, 'ADMIN', $2, $3, true, now())
    `,
    [userId, input.adminEmail, passwordHash],
  );

  await client.query(
    `
      INSERT INTO "${schemaName}"."Admin"
        ("id", "userId", "firstName", "lastName", "updatedAt")
      VALUES
        ($1, $2, $3, $4, now())
    `,
    [adminId, userId, input.adminFirstName, input.adminLastName],
  );

  return {
    status: "created",
    temporaryPassword,
  };
}

async function seedDefaultSchoolConfig(
  client: Client,
  input: ProvisionSchoolInput,
): Promise<"created" | "skipped"> {
  const schemaName = `school_${input.slug}`;
  const existing = await client.query(
    `SELECT id FROM "${schemaName}"."SchoolConfig" LIMIT 1`,
  );

  if (existing.rowCount && existing.rows[0]) {
    return "skipped";
  }

  await client.query(
    `
      INSERT INTO "${schemaName}"."SchoolConfig"
        (
          "id",
          "caWeight",
          "examWeight",
          "jssGradeBands",
          "sssGradeBands",
          "minAveragePercent",
          "minCoreSubjectPercent",
          "schoolName",
          "primaryColor",
          "updatedAt"
        )
      VALUES
        ($1, 40, 60, $2::jsonb, $3::jsonb, 50, 40, $4, '#1B3A6B', now())
    `,
    [
      randomUUID(),
      JSON.stringify(DEFAULT_GRADE_BANDS),
      JSON.stringify(DEFAULT_GRADE_BANDS),
      input.name,
    ],
  );

  return "created";
}

function runTenantOnboarding(schoolSlug: string): void {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const scriptsDir = path.resolve(__dirname);

  execSync(`npx ts-node "${scriptsDir}/onboard-school.ts" ${schoolSlug}`, {
    stdio: "inherit",
  });
}

async function provisionSchool(input: ProvisionSchoolInput): Promise<void> {
  const client = new Client({ connectionString: getDatabaseUrl() });
  await client.connect();

  try {
    await assertSchoolDoesNotExist(client, input);

    console.log(`\n========================================`);
    console.log(`  Provisioning school: ${input.name}`);
    console.log(`========================================`);
    console.log(`  Slug:       ${input.slug}`);
    console.log(`  AdminEmail: ${input.adminEmail}`);
    console.log(
      `  AdminName:  ${input.adminFirstName} ${input.adminLastName}`,
    );
    console.log(`  PlanTier:   ${input.planTier}\n`);

    console.log("Step 1/4 - Provisioning tenant schema and migrations...\n");
    runTenantOnboarding(input.slug);

    await client.query("BEGIN");

    console.log("\nStep 2/4 - Seeding default SchoolConfig...\n");
    const configSeedResult = await seedDefaultSchoolConfig(client, input);

    console.log(
      configSeedResult === "created"
        ? `✓ Default SchoolConfig created in school_${input.slug}`
        : `✓ Existing SchoolConfig preserved in school_${input.slug}`,
    );

    console.log("\nStep 3/4 - Creating school Admin account...\n");
    const adminProvisionResult = await createSchoolAdminAccount(client, input);

    if (adminProvisionResult.status === "created") {
      console.log(`✓ School Admin account created for ${input.adminEmail}`);
      console.log(
        `  Temporary password: ${adminProvisionResult.temporaryPassword}`,
      );
      console.log("  The Admin must change this password on first login");
    } else {
      console.log(
        `✓ Existing school Admin account preserved for ${input.adminEmail}`,
      );
    }

    console.log("\nStep 4/4 - Registering school in public schema...\n");
    await createSchoolRecord(client, input);
    await client.query("COMMIT");

    console.log(`✓ School "${input.name}" provisioned successfully`);
    console.log(`  Schema: school_${input.slug}`);
    console.log(`  Default SchoolConfig: ${configSeedResult}`);
    console.log(`  School Admin: ${adminProvisionResult.status}`);
    console.log(`  Public record created in public."School"`);
    console.log(`  Status: TRIAL`);
  } finally {
    await client.query("ROLLBACK").catch(() => {});
    await client.end();
  }
}

async function main(): Promise<void> {
  try {
    const input = parseArgs(process.argv.slice(2));
    await provisionSchool(input);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown provisioning error";

    console.error(`\n✗ School provisioning failed: ${message}`);
    console.error(
      'Usage: npx ts-node scripts/provision-school.ts --name "School Name" --slug school_slug --admin-email admin@example.com --admin-first-name School --admin-last-name Admin --plan-tier SMALL',
    );
    process.exit(1);
  }
}

main();
