import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { UpdateSchoolConfigDto } from '@reportwise/shared';
import { withTenant } from '../common/tenantHelper.utils.js';

@Injectable()
export class SchoolConfigService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

  /** GET the single SchoolConfig row. There is always exactly one per school. */
  async getConfig(schoolSlug: string) {
    const results: any[] = await withTenant(this.prisma, schoolSlug, (tx) =>
    tx.$queryRaw`
      SELECT * FROM "SchoolConfig" LIMIT 1
    `
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
    return this.prisma.schoolConfig.update({
      where: { id: config.id },
      data: {
        ...(dto.caWeight !== undefined && { caWeight: dto.caWeight }),
        ...(dto.examWeight !== undefined && { examWeight: dto.examWeight }),
        ...(dto.jssGradeBands && { jssGradeBands: dto.jssGradeBands }),
        ...(dto.sssGradeBands && { sssGradeBands: dto.sssGradeBands }),
        ...(dto.minAveragePercent !== undefined && { minAveragePercent: dto.minAveragePercent }),
        ...(dto.minCoreSubjectPercent !== undefined && { minCoreSubjectPercent: dto.minCoreSubjectPercent }),
        ...(dto.schoolName && { schoolName: dto.schoolName }),
        ...(dto.primaryColor && { primaryColor: dto.primaryColor }),
      },
    });
  }
}