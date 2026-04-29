import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();


/**
 * Provisions a new school tenant in the database.
 * Creates a dedicated PostgreSQL schema and runs
 * all tenant-level table definitions inside it.
 *
 * Usage: npx ts-node scripts/provision-tenant.ts <school-slug>
 * Example: npx ts-node scripts/provision-tenant.ts greenfield
 */
async function provisionTenant(schoolSlug: string) {
  const schemaName = `school_${schoolSlug}`;
  const client = new Client({
    connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
  });

  await client.connect();

  try {
    console.log(`Provisioning tenant schema: ${schemaName}`);

    // 1. Create the schema
    await client.query(
      `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`
    );
    console.log(`✓ Schema created: ${schemaName}`);

    // 2. Set search path so subsequent queries target this schema
    await client.query(
      `SET search_path TO "${schemaName}", public`
    );

    // 3. Prisma migrations will be applied here in Sprint 2
    //    For now we just confirm schema creation works
    console.log(`✓ Tenant ${schoolSlug} provisioned successfully`);
    console.log(
      `  Next: run migrations against ${schemaName} to create tables`
    );

  } catch (error) {
    console.error(`✗ Provisioning failed:`, error);
    throw error;
  } finally {
    await client.end();
  }
}

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npx ts-node scripts/provision-tenant.ts <school-slug>");
  process.exit(1);
}

provisionTenant(slug);