import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { UpdateSchoolConfigDto } from '@reportwise/shared';
import { withTenant, retry } from '../common/tenantHelper.utils.js';

@Injectable()
export class SchoolConfigService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) { }

  /** GET the single SchoolConfig row. There is always exactly one per school. */
  async getConfig(schoolSlug: string) {
    const results: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "SchoolConfig" LIMIT 1
        `
      ),
    );
    const config = results[0];
    if (!config) throw new NotFoundException('SchoolConfig not found');
    return config;
  }

  /** PATCH — partial update of SchoolConfig */
  async updateConfig(schoolSlug: string, dto: UpdateSchoolConfigDto) {
    const config = await this.getConfig(schoolSlug);
    console.log('Update DTO:', dto);

    // Build dynamic SET clause for only provided fields
    const fields = [
      { key: 'caWeight', value: dto.caWeight },
      { key: 'examWeight', value: dto.examWeight },
      { key: 'jssGradeBands', value: dto.jssGradeBands },
      { key: 'sssGradeBands', value: dto.sssGradeBands },
      { key: 'minAveragePercent', value: dto.minAveragePercent },
      { key: 'minCoreSubjectPercent', value: dto.minCoreSubjectPercent },
      { key: 'schoolName', value: dto.schoolName },
      { key: 'primaryColor', value: dto.primaryColor },
    ].filter(field => field.value !== undefined);

    if (fields.length === 0) {
      // No fields to update, return early
      return config;
    }

    const setClauses = fields.map(
      (field, i) => `"${field.key}" = $${i + 1}`
    );
    const values = fields.map(f => f.value);

    return await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$executeRawUnsafe(`
          UPDATE "SchoolConfig"
          SET ${setClauses.join(', ')}, "updatedAt" = NOW()
          WHERE id = $${values.length + 1}
          `,
          ...values,
          config.id
        )
      ),
    );
  }
}