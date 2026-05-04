import { execSync } from "child_process";
import * as bcrypt from "bcrypt";
import { randomBytes, randomUUID } from "crypto";
import * as dotenv from "dotenv";
import { Client } from "pg";
import * as path from "path";
import { Resend } from "resend";
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

const CLASS_LEVELS = [
  'JSS1', 'JSS2', 'JSS3', 'SSS1', 'SSS2', 'SSS3'
];

const DEFAULT_TERMS = ['FIRST', 'SECOND', 'THIRD'];

const CA_WEIGHT = 40;
const EXAM_WEIGHT = 60;

const MIN_AVERAGE_PERCENT = 50;
const MIN_CORE_SUBJECT_PERCENT = 40;

const DEFAULT_GRADE_BANDS_JSS: GradeBand[] = [
  { min: 70, max: 100,  grade: 'A', remark: 'Distinction' },
  { min: 60, max: 69,  grade: 'B', remark: 'Excellent' },
  { min: 50, max: 59,  grade: 'C', remark: 'Good' },
  { min: 40, max: 49,  grade: 'D', remark: 'Pass' },
  { min: 0,  max: 39,  grade: 'F', remark: 'Fail' },
];

const DEFAULT_GRADE_BANDS_SSS: GradeBand[] = [
  { min: 75, max: 100, grade: 'A1', remark: 'Excellent' },
  { min: 70, max: 74,  grade: 'B2', remark: 'Very Good' },
  { min: 65, max: 69,  grade: 'B3', remark: 'Good' },
  { min: 60, max: 64,  grade: 'C4', remark: 'Credit' },
  { min: 55, max: 59,  grade: 'C5', remark: 'Credit' },
  { min: 50, max: 54,  grade: 'C6', remark: 'Credit' },
  { min: 45, max: 49,  grade: 'D7', remark: 'Pass' },
  { min: 40, max: 44,  grade: 'E8', remark: 'Pass' },
  { min: 0,  max: 39,  grade: 'F9', remark: 'Fail' },
];


const DEFAULT_ADMIN_FIRST_NAME = "School";
const DEFAULT_ADMIN_LAST_NAME = "Admin";
const PASSWORD_SALT_ROUNDS = 12;
const DEFAULT_RESEND_FROM_EMAIL = "ReportWise <welcome@reportwise.ng>";

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
  const schemaName = `school_${input.slug}`;
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

  const existingSchema = await client.query(
    `
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = $1
      LIMIT 1
    `,
    [schemaName],
  );

  if (existingSchema.rowCount && existingSchema.rows[0]) {
    throw new Error(`Tenant schema "${schemaName}" already exists`);
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendWelcomeEmail(
  input: ProvisionSchoolInput,
  temporaryPassword: string,
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_RESEND_FROM_EMAIL;
  const loginUrl =
    process.env.NEXT_PUBLIC_WEB_URL ||
    process.env.REPORTWISE_WEB_URL ||
    "http://localhost:3000";

  if (!apiKey) {
    console.warn("⚠ Welcome email skipped: RESEND_API_KEY is not set");
    return "skipped";
  }

  const adminName = `${input.adminFirstName} ${input.adminLastName}`.trim();
  const safeSchoolName = escapeHtml(input.name);
  const safeAdminName = escapeHtml(adminName || "School Admin");
  const safeAdminEmail = escapeHtml(input.adminEmail);
  const safeTemporaryPassword = escapeHtml(temporaryPassword);
  const safeLoginUrl = escapeHtml(loginUrl);

  const text = [
    `Welcome to ReportWise, ${adminName || "School Admin"}.`,
    "",
    `Your school, ${input.name}, has been provisioned successfully.`,
    "",
    `Login URL: ${loginUrl}`,
    `Email: ${input.adminEmail}`,
    `Temporary password: ${temporaryPassword}`,
    "",
    "You will be asked to change this password after your first login.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">Welcome to ReportWise</h1>
      <p>Hello ${safeAdminName},</p>
      <p>Your school, <strong>${safeSchoolName}</strong>, has been provisioned successfully.</p>
      <p>You can sign in with these temporary credentials:</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #4b5563;">Login URL</td>
          <td style="padding: 6px 0;"><a href="${safeLoginUrl}">${safeLoginUrl}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #4b5563;">Email</td>
          <td style="padding: 6px 0;">${safeAdminEmail}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; color: #4b5563;">Temporary password</td>
          <td style="padding: 6px 0;"><strong>${safeTemporaryPassword}</strong></td>
        </tr>
      </table>
      <p>Please change this password after your first login.</p>
      <p>ReportWise</p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [input.adminEmail],
      subject: `Welcome to ReportWise - ${input.name}`,
      html,
      text,
    });

    if (error) {
      console.warn(`⚠ Welcome email failed: ${JSON.stringify(error)}`);
      return "failed";
    }

    console.log(`✓ Welcome email sent to ${input.adminEmail}`);
    return "sent";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`⚠ Welcome email failed: ${message}`);
    return "failed";
  }
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
        ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, $8, '#1B3A6B', now())
    `,
    [
      randomUUID(),
      CA_WEIGHT,
      EXAM_WEIGHT,
      JSON.stringify(DEFAULT_GRADE_BANDS_JSS),
      JSON.stringify(DEFAULT_GRADE_BANDS_SSS),
      MIN_AVERAGE_PERCENT,
      MIN_CORE_SUBJECT_PERCENT,
      input.name,
    ],
  );

  return "created";
}

async function seedClasses(
  client: Client,
  input: ProvisionSchoolInput
): Promise<"created" | "skipped"> {
  const schemaName = `school_${input.slug}`;
  // For simplicity, we assume that if any Class records exist, then the default classes have already been seeded.
  const existing = await client.query(
    `SELECT id FROM "${schemaName}"."Class" LIMIT 1`,
  );
  if (existing.rowCount && existing.rows[0]) {
    return "skipped";
  }
  for (const level of CLASS_LEVELS) {
        await client.query(
          `INSERT INTO "${schemaName}"."Class" (id, level, "updatedAt")
           VALUES ($1, $2, now())`,
          [randomUUID(), level]
        );
      };

      return "created";
}

async function seedSession(
  client: Client,
  input: ProvisionSchoolInput
): Promise<"created" | "skipped"> {
  const schemaName = `school_${input.slug}`;
  // For simplicity, we assume that if any Session records exist, then the default session has already been seeded.
  const existing = await client.query(
    `SELECT id FROM "${schemaName}"."AcademicSession" LIMIT 1`,
  );
  if (existing.rowCount && existing.rows[0]) {
    return "skipped";
  }
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const sessionName = `${currentYear}/${nextYear}`;
  const startDate = new Date(currentYear, 8, 1); // September 1st
  const endDate = new Date(nextYear, 5, 31); // June 30th
  
  await client.query(
    `INSERT INTO "${schemaName}"."AcademicSession" (id, label, "startDate", "endDate", "updatedAt")
     VALUES ($1, $2, $3, $4, now())`,
    [randomUUID(), sessionName, startDate, endDate]
  );

  // Set isActive for seeded session to true
  await client.query(
    `UPDATE "${schemaName}"."AcademicSession"
     SET "isActive" = true
     WHERE label = $1`,
    [sessionName]
  )
  console.log(`✓ Default academic session "${sessionName}" created and set as active in school_${input.slug}`);
  return "created";
}

async function seedTerms(
  client: Client,
  input: ProvisionSchoolInput
): Promise<"created" | "skipped"> {
  const schemaName = `school_${input.slug}`;
  // For simplicity, we assume that if any TermRecord records exist, then the default terms have already been seeded.
  const existing = await client.query(
    `SELECT id FROM "${schemaName}"."TermRecord" LIMIT 1`,
  );
  if (existing.rowCount && existing.rows[0]) {
    return "skipped";
  }
  const sessionResult = await client.query(
    `SELECT * FROM "${schemaName}"."AcademicSession" WHERE id = (SELECT id FROM "${schemaName}"."AcademicSession" LIMIT 1)`,
  );
  const sessionStartDate = new Date(sessionResult.rows[0].startDate);
  const sessionEndDate = new Date(sessionResult.rows[0].endDate);
  const termDuration = (sessionEndDate.getTime() - sessionStartDate.getTime()) / 3;
  const startDate: Date[] = [sessionStartDate, new Date(sessionStartDate.getTime() + termDuration), new Date(sessionStartDate.getTime() + 2 * termDuration)];
  const endDate: Date[] = [new Date(sessionStartDate.getTime() + termDuration - 1), new Date(sessionStartDate.getTime() + 2 * termDuration - 1), sessionEndDate];
  // Insert default terms
    for (let i = 0; i < DEFAULT_TERMS.length; i++) {
      await client.query(
      `INSERT INTO "${schemaName}"."TermRecord" (id, "sessionId", term, "startDate", "endDate", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, now())`,
      [randomUUID(), sessionResult.rows[0].id, DEFAULT_TERMS[i], startDate[i], endDate[i]]
    );
    }

  // Set FIRST term as active by default
  await client.query(
    `UPDATE "${schemaName}"."TermRecord"
     SET "isActive" = true
     WHERE term = 'FIRST' AND "sessionId" = $1`,
    [sessionResult.rows[0].id]
  )
  console.log(`✓ Default terms created and FIRST term set as active in school_${input.slug}`);
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

    console.log("Step 1/8 - Provisioning tenant schema and migrations...\n");
    runTenantOnboarding(input.slug);

    await client.query("BEGIN");

    console.log("\nStep 2/8 - Seeding default SchoolConfig...\n");
    const configSeedResult = await seedDefaultSchoolConfig(client, input);

    console.log(
      configSeedResult === "created"
        ? `✓ Default SchoolConfig created in school_${input.slug}`
        : `✓ Existing SchoolConfig preserved in school_${input.slug}`,
    );

    console.log("\nStep 3/8 - Seeding default Classes...\n");
    const classesSeedResult = await seedClasses(client, input);
    console.log(
      classesSeedResult === "created"
        ? `✓ Default Classes created in school_${input.slug}`
        : `✓ Existing Classes preserved in school_${input.slug}`,
    );

    console.log("\nStep 4/8 - Seeding default Academic Session...\n");
    const sessionSeedResult = await seedSession(client, input);
    console.log(
      sessionSeedResult === "created"
        ? `✓ Default Academic Session created in school_${input.slug}`
        : `✓ Existing Academic Session preserved in school_${input.slug}`,
    );

    console.log("\nStep 5/8 - Seeding default Terms...\n");
    const termsSeedResult = await seedTerms(client, input);
    console.log(
      termsSeedResult === "created"
        ? `✓ Default Terms created in school_${input.slug}`
        : `✓ Existing Terms preserved in school_${input.slug}`,
    );

    console.log("\nStep 6/8 - Creating school Admin account...\n");
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

    console.log("\nStep 7/8 - Registering school in public schema...\n");
    await createSchoolRecord(client, input);
    await client.query("COMMIT");

    console.log("\nStep 8/8 - Sending welcome email...\n");
    const welcomeEmailResult =
      adminProvisionResult.status === "created"
        ? await sendWelcomeEmail(input, adminProvisionResult.temporaryPassword)
        : "skipped";

    console.log(`✓ School "${input.name}" provisioned successfully`);
    console.log(`  Schema: school_${input.slug}`);
    console.log(`  Default SchoolConfig: ${configSeedResult}`);
    console.log(`  Default Classes: ${classesSeedResult}`);
    console.log(`  School Admin: ${adminProvisionResult.status}`);
    console.log(`  Welcome Email: ${welcomeEmailResult}`);
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
