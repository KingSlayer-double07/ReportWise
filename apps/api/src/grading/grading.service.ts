import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { GradeBand, SchoolConfig } from '@reportwise/shared';
import { withTenant, retry } from '../common/tenantHelper.utils.js';

export interface GradeResult {
  total:     number;   // rounded to 2dp
  grade:     string;
  remark:    string;
}

@Injectable()
export class GradingService {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

  /** Loads SchoolConfig from DB. Always reads from DB — no caching. */
  private async loadConfig(schoolSlug: string): Promise<SchoolConfig> {
    return await retry(() =>
    withTenant(this.prisma, schoolSlug, (tx) => 
    tx.$queryRaw`
    SELECT * FROM "SchoolConfig" LIMIT 1
    `)
    );
  }

  /**
   * Calculates the weighted total and looks up the grade band.
   * @param caScore   — raw CA score (e.g. 35 out of 40)
   * @param examScore — raw exam score (e.g. 58 out of 60)
   * @param classLevel — 'JSS1'|'JSS2'|'JSS3'|'SSS1'|'SSS2'|'SSS3'
   */
  async calculateGrade(
    schoolSlug: string,
    caScore: number,
    examScore: number,
    classLevel: string,
  ): Promise<GradeResult> {
    const config = await this.loadConfig(schoolSlug);

    // Validate inputs
    if (caScore > config.caWeight) {
      throw new BadRequestException(`CA score ${caScore} exceeds max weight ${config.caWeight}`);
    }
    if (examScore > config.examWeight) {
      throw new BadRequestException(`Exam score ${examScore} exceeds max weight ${config.examWeight}`);
    }

    // Total = caScore + examScore (both are already out of their weight)
    // e.g. CA max=40, exam max=60 → total max=100
    const total = Math.round((caScore + examScore) * 100) / 100;

    // Pick grade band set based on class level
    const isSSS = classLevel.startsWith('SSS');
    const bands: GradeBand[] = isSSS
      ? (config.sssGradeBands as GradeBand[])
      : (config.jssGradeBands as GradeBand[]);

    // Find the matching band
    const band = bands.find(b => total >= b.min && total <= b.max);

    if (!band) {
      // Fallback — should never happen if bands are configured correctly
      return { total, grade: 'F9', remark: 'Fail' };
    }

    return { total, grade: band.grade, remark: band.remark };
  }

  /**
   * Determines if a student is eligible for promotion.
   * Reads minAveragePercent and minCoreSubjectPercent from SchoolConfig.
   */
  async isEligibleForPromotion(
    schoolSlug: string,
    scores: Array<{ total: number; isCore: boolean }>,
  ): Promise<boolean> {
    const config = await this.loadConfig(schoolSlug);

    if (scores.length === 0) return false;

    const overallAvg = scores.reduce((s, sc) => s + sc.total, 0) / scores.length;
    if (overallAvg < config.minAveragePercent) return false;

    // Core subjects must each individually meet the minimum
    const coreScores = scores.filter(s => s.isCore);
    const failedCore = coreScores.some(s => s.total < config.minCoreSubjectPercent);
    if (failedCore) return false;

    return true;
  }
}