import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

/**
 * Runs Prisma migration SQL files directly against a tenant schema.
 * Bypasses the Prisma CLI to allow precise search_path control.
 *
 * Usage:  npx ts-node scripts/migrate-tenant.ts <school-slug>
 * Example: npx ts-node scripts/migrate-tenant.ts greenfield
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, "../prisma/migrations");

interface MigrationRecord {
  migration_name: string;
}

async function migrateTenant(schoolSlug: string): Promise<void> {
  const schemaName = `school_${schoolSlug}`;
  const directUrl  = process.env.DIRECT_URL;

  if (!directUrl) {
    console.error("✗ DIRECT_URL is not set. Check packages/database/.env");
    process.exit(1);
  }

  const client = new Client({ connectionString: directUrl });
  await client.connect();

  try {
    console.log(`\nRunning migrations for tenant: ${schemaName}\n`);

    // 1. Target the tenant schema for all subsequent queries
    await client.query(`SET search_path TO "${schemaName}", public`);

    // 2. Create Prisma's migration tracking table inside the tenant schema
    //    if it doesn't already exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id"                  VARCHAR(36)  NOT NULL PRIMARY KEY,
        "checksum"            VARCHAR(64)  NOT NULL,
        "finished_at"         TIMESTAMPTZ,
        "migration_name"      VARCHAR(255) NOT NULL,
        "logs"                TEXT,
        "rolled_back_at"      TIMESTAMPTZ,
        "started_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
        "applied_steps_count" INTEGER     NOT NULL DEFAULT 0
      )
    `);

    // 3. Read which migrations have already been applied in this schema
    const applied = await client.query<MigrationRecord>(
      `SELECT migration_name FROM "_prisma_migrations"
       WHERE finished_at IS NOT NULL
       ORDER BY started_at ASC`
    );
    const appliedNames = new Set(
      applied.rows.map((r) => r.migration_name)
    );

    // 4. Read all migration folders sorted chronologically
    const migrationFolders = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) =>
        fs.statSync(path.join(MIGRATIONS_DIR, f)).isDirectory()
      )
      .sort();

    if (migrationFolders.length === 0) {
      console.log("No migrations found. Run pnpm db:migrate first.");
      return;
    }

    let applied_count = 0;
    let skipped_count = 0;

    // 5. Execute each pending migration in order
    for (const folder of migrationFolders) {
      const sqlPath = path.join(MIGRATIONS_DIR, folder, "migration.sql");

      if (!fs.existsSync(sqlPath)) {
        continue;
      }

      if (appliedNames.has(folder)) {
        console.log(`  ⟳  Already applied: ${folder}`);
        skipped_count++;
        continue;
      }

      const sql      = fs.readFileSync(sqlPath, "utf-8");
      const checksum = crypto
        .createHash("sha256")
        .update(sql)
        .digest("hex")
        .slice(0, 64);
      const id       = crypto.randomUUID();

      console.log(`  ↳  Applying: ${folder}`);

      // Record as started
      await client.query(
        `INSERT INTO "_prisma_migrations"
          (id, checksum, migration_name, started_at, applied_steps_count)
         VALUES ($1, $2, $3, now(), 0)`,
        [id, checksum, folder]
      );

      // Execute the migration SQL
      await client.query(sql);

      // Mark as finished
      await client.query(
        `UPDATE "_prisma_migrations"
         SET finished_at = now(), applied_steps_count = 1
         WHERE id = $1`,
        [id]
      );

      console.log(`  ✓  Applied:  ${folder}`);
      applied_count++;
    }

    console.log(`
Migration summary for ${schemaName}:
  Applied:  ${applied_count}
  Skipped:  ${skipped_count} (already applied)
✓ Migration complete
`);

  } catch (error) {
    console.error(`\n✗ Migration failed for ${schemaName}:`, error);
    throw error;
  } finally {
    await client.end();
  }
}

const slug = process.argv[2];

if (!slug) {
  console.error(
    "Usage: npx ts-node scripts/migrate-tenant.ts <school-slug>"
  );
  process.exit(1);
}

migrateTenant(slug).catch(() => process.exit(1));