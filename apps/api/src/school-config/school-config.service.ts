import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { UpdateSchoolConfigDto } from '@reportwise/shared';
import { withTenant, retry } from '../common/tenantHelper.utils.js';

@Injectable()
export class SchoolConfigService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

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
    console.log('Fetched SchoolConfig:', config);
    if (!config) throw new NotFoundException('SchoolConfig not found');
    return config;
  }

  /** PATCH — partial update of SchoolConfig */
  async updateConfig(schoolSlug: string, dto: UpdateSchoolConfigDto) {
    const config = await this.getConfig(schoolSlug);
    console.log('Update DTO:', dto);
    return await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$executeRaw`
          UPDATE "SchoolConfig"
          SET 
            "caWeight" = ${dto.caWeight},
            "examWeight" = ${dto.examWeight},
            "jssGradeBands" = ${dto.jssGradeBands},
            "sssGradeBands" = ${dto.sssGradeBands},
            "minAveragePercent" = ${dto.minAveragePercent},
            "minCoreSubjectPercent" = ${dto.minCoreSubjectPercent},
            "schoolName" = ${dto.schoolName},
            "primaryColor" = ${dto.primaryColor},
            "updatedAt" = NOW()
          WHERE id = ${config.id}
        `
      ),
    );
  }
}