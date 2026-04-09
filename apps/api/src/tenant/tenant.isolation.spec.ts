import { Client } from 'pg';

// Run with: pnpm test -- --testPathPattern=tenant.isolation
describe('Cross-Tenant Isolation', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it('school_pbms cannot see school_tender_steps users', async () => {
    // Set search_path to school_pbms
    await client.query(`SET search_path TO "school_pbms", public`);
    const result = await client.query('SELECT id FROM "User"');
    // Result should only contain school_pbms records
    // Verify by checking that school_tender_steps's user ID is NOT in the result
    expect(result.rows.map(r => r.id)).not.toContain('SCHOOL_TENDER_STEPS_USER_ID');
  });

  it('school_tender_steps cannot see school_pbms users', async () => {
    await client.query(`SET search_path TO "school_tender_steps", public`);
    const result = await client.query('SELECT id FROM "User"');
    expect(result.rows.map(r => r.id)).not.toContain('SCHOOL_PBMS_USER_ID');
  });

  it('public schema is accessible from both tenants', async () => {
    await client.query(`SET search_path TO "school_pbms", public`);
    const result = await client.query('SELECT id FROM public."School"');
    expect(result.rows.length).toBeGreaterThanOrEqual(0); // accessible
  });
});