# Tenant Isolation Architecture

## Approach
Schema-per-tenant using PostgreSQL schemas within a single Supabase database.

## Schema naming convention
Every school gets a schema named `school_{slug}` where slug is the
school's unique identifier (lowercase, no spaces).
Example: Greenfield Academy → `school_greenfield`

## Public schema
Platform-level tables (School, SuperAdmin, BillingRecord) live in the
default `public` schema. These are never replicated per tenant.

## Tenant schema
All school-level models (User, Student, Teacher, Score, etc.) are
created inside the school's own schema via the provisioning script.

## How isolation is enforced
NestJS tenant middleware extracts the school slug from the request JWT
and runs `SET search_path TO school_{slug}, public` before every
request handler. This means:
- All Prisma queries automatically target the correct school's tables
- No tenant ID filter needed on every query
- Cross-tenant access is impossible at the database level

## Super Admin bypass
Super Admin JWTs carry no schoolSlug. The tenant middleware detects
this and skips search_path injection, allowing queries against the
public schema only.

## Provisioning
Each new school is onboarded by running:
  npx ts-node scripts/provision-tenant.ts <slug>

This creates the schema and applies all tenant-level migrations.
The full migration runner is implemented in Sprint 2.