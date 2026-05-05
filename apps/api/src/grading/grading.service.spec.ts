import { GradingService } from "./grading.service.js";
describe('GradingService (unit)', () => {
  let gradingService: GradingService;
  const mockConfig = {
    caWeight: 40,
    examWeight: 60,
    jssGradeBands: [
      { min: 0, max: 39.99, grade: 'F9', remark: 'Fail' },
      { min: 40, max: 59.99, grade: 'C6', remark: 'Pass' },
      { min: 60, max: 100, grade: 'A1', remark: 'Excellent' },
    ],
    sssGradeBands: [
      { min: 0, max: 49.99, grade: 'F9', remark: 'Fail' },
      { min: 50, max: 64.99, grade: 'C6', remark: 'Pass' },
      { min: 65, max: 100, grade: 'A1', remark: 'Excellent' },
    ],
    minAveragePercent: 50,
    minCoreSubjectPercent: 60,
  } as any;

  beforeEach(() => {
    gradingService = new GradingService({} as any);
    (gradingService as any).loadConfig = jest.fn().mockResolvedValue(mockConfig);
  });

  it('calculates the correct JSS grade and remark', async () => {
    const result = await gradingService.calculateGrade('school_pbms', 35, 55, 'JSS3');

    expect(result).toEqual({
      total: 90,
      grade: 'A1',
      remark: 'Excellent',
    });
  });

  it('calculates the correct SSS grade and remark', async () => {
    const result = await gradingService.calculateGrade('school_pbms', 25, 40, 'SSS1');

    expect(result).toEqual({
      total: 65,
      grade: 'A1',
      remark: 'Excellent',
    });
  });

  it('returns false when overall average is below promotion threshold', async () => {
    const result = await gradingService.isEligibleForPromotion('school_pbms', [
      { total: 45, isCore: true },
      { total: 50, isCore: false },
    ]);

    expect(result).toBe(false);
  });

  it('returns false when a core subject is below minimum core score', async () => {
    const result = await gradingService.isEligibleForPromotion('school_pbms', [
      { total: 70, isCore: true },
      { total: 55, isCore: true },
      { total: 80, isCore: false },
    ]);

    expect(result).toBe(false);
  });

  it('returns true when promotion criteria are met', async () => {
    const result = await gradingService.isEligibleForPromotion('school_pbms', [
      { total: 70, isCore: true },
      { total: 65, isCore: true },
      { total: 80, isCore: false },
    ]);

    expect(result).toBe(true);
  });
});