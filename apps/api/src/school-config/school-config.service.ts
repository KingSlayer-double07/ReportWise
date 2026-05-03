import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { UpdateSchoolConfigDto } from '@reportwise/shared';

@Injectable()
export class SchoolConfigService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

  /** GET the single SchoolConfig row. There is always exactly one per school. */
  async getConfig() {
    const config = await this.prisma.schoolConfig.findFirst();
    if (!config) throw new NotFoundException('SchoolConfig not found');
    return config;
  }

  /** PATCH — partial update of SchoolConfig */
  async updateConfig(dto: UpdateSchoolConfigDto) {
    const config = await this.getConfig();
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