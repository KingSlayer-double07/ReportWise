import { execSync } from "child_process";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

/**
 * Runs Prisma migrations against a specific tenant schema.
 * Called after provision-tenant.ts to create all tables
 * inside the school's PostgreSQL schema.
 *
 * Usage:  npx ts-node scripts/migrate-tenant.ts <school-slug>
 * Example: npx ts-node scripts/migrate-tenant.ts greenfield
 */
function buildTenantUrl(schoolSlug: string): string {
  const baseUrl = process.env.DIRECT_URL;

  if (!baseUrl) {
    console.error("✗ DIRECT_URL is not set. Check packages/database/.env");
    process.exit(1);
  }

  const schemaName = `school_${schoolSlug}`;

  // Append the search_path option to the connection string
  // This tells Prisma's migration engine which schema to target
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}options=--search_path%3D${schemaName}`;
}

function migrateTenant(schoolSlug: string): void {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const schemaName  = `school_${schoolSlug}`;
  const tenantUrl   = buildTenantUrl(schoolSlug);
  const schemaPath  = path.resolve(__dirname, "../prisma/schema.prisma");

  console.log(`\nRunning migrations for tenant: ${schemaName}`);
  console.log(`Schema file: ${schemaPath}\n`);

  try {
    execSync(`prisma migrate deploy --schema="${schemaPath}"`, {
      env: {
        ...process.env,
        DIRECT_URL: tenantUrl,
      },
      stdio: "inherit",  // streams prisma output directly to terminal
    });

    console.log(`\n✓ Migrations complete for ${schemaName}`);
  } catch (error) {
    console.error(`\n✗ Migration failed for ${schemaName}:`, error);
    process.exit(1);
  }
}

const slug = process.argv[2];

if (!slug) {
  console.error(
    "Usage: npx ts-node scripts/migrate-tenant.ts <school-slug>"
  );
  process.exit(1);
}

migrateTenant(slug);