import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { withTenant, retry } from '../common/tenantHelper.utils.js';
import { CreateSessionDto, CreateTermDto, UpdateTermDto } from '@reportwise/shared';
import { randomUUID } from 'crypto';
import { ApiCreateTermDto } from '../apiDtos/index.js';

  const ALLOWED_TERM_NUMBERS = ['FIRST', 'SECOND', 'THIRD'] as const;
  type TermNumber = typeof ALLOWED_TERM_NUMBERS[number];
@Injectable()
export class AcademicSessionService {
    constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

  /** POST /sessions Create a new academic session */
  async createSession(schoolSlug: string, dto: CreateSessionDto) {
    const newSession = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$executeRaw`
          INSERT INTO "AcademicSession" ("id", "label", "startDate", "endDate", "updatedAt")
          VALUES (${randomUUID()}, ${dto.label}, ${dto.startDate}, ${dto.endDate}, NOW())
          RETURNING *
        `
      ),
    );

    return newSession;
  }

  /** GET /sessions Retrieve all academic sessions */
  async listSessions(schoolSlug: string) {
    const sessionsResult: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "AcademicSession" ORDER BY "createdAt" DESC
        `
      )
    );

    const sessions: any[] = sessionsResult;
    if(!sessions || sessions.length === 0) {
        throw new NotFoundException('No academic sessions found.');
    }
    return sessions;
  }

  /** GET /sessions/active Returns the single active academic session */
  async getActiveSession(schoolSlug: string) {
    const activeSessionResult: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "AcademicSession"
          WHERE "isActive" = true
        `
      )
    );

    const activeSession = activeSessionResult[0];
    if (!activeSession) {
      throw new NotFoundException('No active academic session found.');
    }
    return activeSession;
  }

  /** PATCH /sessions/:id Activate an academic session */
  async activateSession(schoolSlug: string, sessionId: string) {
    const sessionResult: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "AcademicSession"
          WHERE "id" = ${sessionId}
        `
      )
    );

    const session = sessionResult[0];
    if (!session) {
      throw new NotFoundException('Academic session not found.');
    }

    return await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$executeRaw`
          UPDATE "AcademicSession"
          SET "isActive" = CASE WHEN "id" = ${sessionId} THEN true ELSE false END, "updatedAt" = NOW()
        `
      )
    );
  }

  /** POST /sessions/:id/terms Create a new academic term */
  async createTerm(schoolSlug: string, dto: CreateTermDto) {
    const sessionResult: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "AcademicSession"
          WHERE "id" = ${dto.sessionId}
        `
      )
    );

    const session = sessionResult[0];
    if (!session) {
      throw new NotFoundException('Academic session not found.');
    }

    //Check valid term number
    if (!ALLOWED_TERM_NUMBERS.includes(dto.termNumber as TermNumber)) {
      throw new ConflictException(`Invalid term number "${dto.termNumber}". Term number must be one of FIRST, SECOND or THIRD.`);
    }
    
    //Check duplicate term number within the same session
    const existingTermResult: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "TermRecord"
          WHERE "term" = ${dto.termNumber} AND "sessionId" = ${dto.sessionId}
        `
      )
    );
    const existingTerm = existingTermResult[0];
    if (existingTerm) {
      throw new ConflictException('This academic term already exists in this session.');
    }

    //Ensure term dates are within session dates
    if (new Date(dto.startDate) < new Date(session.startDate) || new Date(dto.endDate) > new Date(session.endDate)) {
      throw new ConflictException('Term dates must be within the academic session dates.');
    }

    //Ensure valid date range
    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new ConflictException('Term start date must be before end date.');
    }

    //Ensure max of 3 terms per session
    const termCount: number = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT COUNT(*) FROM "TermRecord"
          WHERE "sessionId" = ${dto.sessionId}
        `
      )
    );
    if (termCount >= 3) {
      throw new ConflictException('An academic session can only have a maximum of 3 terms.');
    }

    const newTerm: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$executeRaw`
          INSERT INTO "TermRecord" ("id", "term", "startDate", "endDate", "sessionId", "updatedAt")
          VALUES (${randomUUID()}, ${dto.termNumber}, ${dto.startDate}, ${dto.endDate}, ${dto.sessionId}, NOW())
          RETURNING *
        `
      )
    );
    return newTerm;
  }

  /** GET /sessions/terms Retrieve all academic terms */
  async listTerms(schoolSlug: string) {
    const termsResult: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "TermRecord" ORDER BY "createdAt" DESC
        `
      )
    );

    const terms: any[] = termsResult;
    if(!terms || terms.length === 0) {
        throw new NotFoundException('No academic terms found.');
    }
    return terms;
  }
  
  /** GET /sessions/:id/terms/active Retrieve the active academic term */
  async getActiveTerm(schoolSlug: string) {
    const activeTermResult: any[] = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "TermRecord"
          WHERE "isActive" = true
        `
      )
    );
    const activeTerm = activeTermResult[0];
    if (!activeTerm) {
      throw new NotFoundException('No active academic term found.');
    }
    return activeTerm;
  }

  /** PATCH /sessions/terms/:id/activate Activate the active academic term */
  async activateTerm(schoolSlug: string, termId: string) {
    const term = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "TermRecord"
          WHERE "id" = ${termId}
        `
      )
    );

    if (!term) {
      throw new NotFoundException('Academic term not found.');
    }
    return await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$executeRaw`
          UPDATE "TermRecord"
          SET "isActive" = CASE WHEN "id" = ${termId} THEN true ELSE false END, "updatedAt" = NOW()
        `
      )
    );
  }

  /** PATCH /sessions/terms/:id/dates Update academic term dates */
  async updateTermDates(schoolSlug: string, termId: string, dto: UpdateTermDto) {
    const term = await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "TermRecord"
          WHERE "id" = ${termId}
        `
      )
    );
    if (!term) {
      throw new NotFoundException('Academic term not found.');
    }
    return await retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$executeRaw`
          UPDATE "TermRecord"
          SET "startDate" = ${dto.startDate}, "endDate" = ${dto.endDate}, "updatedAt" = NOW()
          WHERE "id" = ${termId}
        `
      )
    );
  }
}