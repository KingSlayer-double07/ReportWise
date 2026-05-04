import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { Client } from 'pg';
import { resolve } from 'path';
import type { ProvisionSchoolDto } from '../super-admin/dtos/provision-school.dto.js';

export interface ProvisionSchoolResult {
  schoolName: string;
  schoolSlug: string;
  schemaName: string;
  adminEmail: string;
  planTier: string;
  message: string;
}

@Injectable()
export class TenantProvisioningService {
  async provisionSchool(
    dto: ProvisionSchoolDto,
  ): Promise<ProvisionSchoolResult> {
    this.validateProvisionRequest(dto);
    await this.assertProvisionTargetIsAvailable(dto);

    const repoRoot = this.resolveRepoRoot();
    const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    const args = [
      '--filter',
      '@reportwise/database',
      'provision:school',
      '--name',
      `"${dto.name.toString().trim()}"`,
      '--slug',
      `"${dto.slug.toLowerCase().trim()}"`,
      '--admin-email',
      `"${dto.adminEmail.trim().toLowerCase()}"`,
      '--plan-tier',
      `"${String(dto.planTier).trim().toUpperCase()}"`,
    ];

    await new Promise<void>((resolvePromise, rejectPromise) => {
      const child = spawn(command, args, {
        cwd: repoRoot,
        env: process.env,
        stdio: 'inherit',
        shell: true,
      });

      child.on('error', (error) => {
        rejectPromise(
          new InternalServerErrorException(
            `Failed to start school provisioning command: ${error.message}`,
          ),
        );
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolvePromise();
          return;
        }

        rejectPromise(
          new InternalServerErrorException(
            `School provisioning command failed with exit code ${code ?? 'unknown'}`,
          ),
        );
      });
    });

    return {
      schoolName: dto.name.trim(),
      schoolSlug: dto.slug.trim(),
      schemaName: `school_${dto.slug.trim()}`,
      adminEmail: dto.adminEmail.trim().toLowerCase(),
      planTier: String(dto.planTier).trim().toUpperCase(),
      message:
        'School schema provisioning completed, default SchoolConfig, AcademicSession, TermRecords and Classes were seeded, and the first Admin account was created. The temporary password is emitted in the provisioning logs.',
    };
  }

  private validateProvisionRequest(dto: ProvisionSchoolDto): void {
    if (!dto?.name?.trim()) {
      throw new BadRequestException('School name is required');
    }

    if (!dto?.slug?.trim()) {
      throw new BadRequestException('School slug is required');
    }

    if (!/^[a-z0-9_]+$/.test(dto.slug.trim())) {
      throw new BadRequestException(
        'School slug must contain only lowercase letters, numbers, and underscores',
      );
    }

    if (!dto?.adminEmail?.trim()) {
      throw new BadRequestException('Admin email is required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.adminEmail.trim())) {
      throw new BadRequestException('Admin email must be a valid email address');
    }

    if (!String(dto.planTier ?? '').trim()) {
      throw new BadRequestException('Plan tier is required');
    }
  }

  private async assertProvisionTargetIsAvailable(
    dto: ProvisionSchoolDto,
  ): Promise<void> {
    const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

    if (!databaseUrl) {
      throw new InternalServerErrorException(
        'DATABASE_URL or DIRECT_URL must be set before provisioning a school',
      );
    }

    const slug = dto.slug.trim();
    const adminEmail = dto.adminEmail.trim().toLowerCase();
    const schemaName = `school_${slug}`;
    const client = new Client({ connectionString: databaseUrl });

    await client.connect();

    try {
      const existingSchool = await client.query<{
        slug: string;
        adminEmail: string;
      }>(
        `
          SELECT slug, "adminEmail"
          FROM public."School"
          WHERE slug = $1 OR "adminEmail" = $2
          LIMIT 1
        `,
        [slug, adminEmail],
      );

      if (existingSchool.rowCount && existingSchool.rows[0]) {
        const row = existingSchool.rows[0];

        if (row.slug === slug) {
          throw new ConflictException(
            `A school with slug "${slug}" already exists`,
          );
        }

        if (row.adminEmail === adminEmail) {
          throw new ConflictException(
            `A school with admin email "${adminEmail}" already exists`,
          );
        }
      }

      const existingSchema = await client.query<{ schema_name: string }>(
        `
          SELECT schema_name
          FROM information_schema.schemata
          WHERE schema_name = $1
          LIMIT 1
        `,
        [schemaName],
      );

      if (existingSchema.rowCount && existingSchema.rows[0]) {
        throw new ConflictException(
          `Tenant schema "${schemaName}" already exists`,
        );
      }
    } finally {
      await client.end();
    }
  }

  private resolveRepoRoot(): string {
    const candidates = [
      process.cwd(),
      resolve(process.cwd(), '..'),
      resolve(process.cwd(), '../..'),
    ];

    const repoRoot = candidates.find((candidate) => {
      return (
        existsSync(resolve(candidate, 'pnpm-workspace.yaml')) &&
        existsSync(resolve(candidate, 'packages/database/package.json'))
      );
    });

    if (!repoRoot) {
      throw new InternalServerErrorException(
        'Unable to locate the repository root for school provisioning',
      );
    }

    return repoRoot;
  }
}
