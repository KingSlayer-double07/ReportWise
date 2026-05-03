import { execSync } from "child_process";
import * as path from "path";
import { fileURLToPath } from "url";

/**
 * Full school onboarding sequence.
 * Runs provision then migrate in one command.
 *
 * Usage:  npx ts-node scripts/onboard-school.ts <school-slug>
 * Example: npx ts-node scripts/onboard-school.ts greenfield
 */
const slug = process.argv[2];

if (!slug) {
  console.error(
    "Usage: npx ts-node scripts/onboard-school.ts <school-slug>"
  );
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptsDir = path.resolve(__dirname);

console.log(`\n========================================`);
console.log(`  Onboarding school: ${slug}`);
console.log(`========================================\n`);

try {
  // Step 1 — Create the PostgreSQL schema
  console.log("Step 1/2 — Provisioning schema...\n");
  execSync(
    `npx ts-node "${scriptsDir}/provision-tenant.ts" ${slug}`,
    { stdio: "inherit" }
  );

  // Step 2 — Run all Prisma migrations against the new schema
  console.log("\nStep 2/2 — Running migrations...\n");
  execSync(
    `npx ts-node "${scriptsDir}/migrate-tenant.ts" ${slug}`,
    { stdio: "inherit" }
  );

  console.log(`\n========================================`);
  console.log(`  ✓ School "${slug}" is ready`);
  console.log(`  Next: run the seed script to create`);
  console.log(`  default config and Admin account`);
  console.log(`========================================\n`);

} catch {
  console.error(`\n✗ Onboarding failed for school: ${slug}`);
  process.exit(1);
}