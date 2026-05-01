import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();


/**
 * Creates a dedicated PostgreSQL schema for a school tenant.
 *
 * This is the schema-only step. To create the schema and run tenant
 * migrations in one command, use scripts/onboard-school.ts.
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

    console.log(`✓ Tenant schema ${schemaName} provisioned successfully`);
    console.log(
      `  Next: run scripts/migrate-tenant.ts ${schoolSlug}, or use scripts/onboard-school.ts ${schoolSlug} for schema + migrations`
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
