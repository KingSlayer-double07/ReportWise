import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { withTenant } from '../common/tenantHelper.utils.js';
import { CreateSessionDto, CreateTermDto, UpdateTermDto } from '@reportwise/shared';

@Injectable()
export class AcademicSessionService {
    constructor(
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

  /** POST /academic-sessions Create a new academic session */
  async createSession(dto: CreateSessionDto) {
    // Ensure only one active session per school
    const activeSession = await this.prisma.AcademicSession.findFirst({
      where: { isActive: true },
    });
    if (activeSession) {
      throw new ConflictException('An active academic session already exists. Please deactivate it before creating a new one.');
    }

    const newSession = await this.prisma.AcademicSession.create({
        data: {
            label: dto.label,
            startDate: dto.startDate,
            endDate: dto.endDate,
        },
    });
    return newSession;
  }

  /** GET /academic-sessions Retrieve all academic sessions */
  async listSessions() {
    const sessions = await this.prisma.AcademicSession.findMany(
        { orderBy: { startDate: 'desc' } }
    );
    if(!sessions || sessions.length === 0) {
        throw new NotFoundException('No academic sessions found.');
    }
    return sessions;
  }

  /** GET /academic-sessions/active Returns the single active academic session */
  async getActiveSession() {
    const activeSession = await this.prisma.AcademicSession.findFirst({
      where: { isActive: true },
    });
    if (!activeSession) {
      throw new NotFoundException('No active academic session found.');
    }
    return activeSession;
  }

  /** PATCH /academic-sessions/:id Activate an academic session */
  async activateSession(sessionId: string) {
    const session = await this.prisma.AcademicSession.findUnique({
      where: { sessionId },
    });
    if (!session) {
      throw new NotFoundException('Academic session not found.');
    }
    return this.prisma.AcademicSession.update({
      where: { sessionId },
      data: { isActive: true },
    });
  }

  /** POST /academic-sessions/:id/create-term Create a new academic term */
  async createTerm(dto: CreateTermDto) {
    const session = await this.prisma.AcademicSession.findUnique({
      where: { sessionId: dto.sessionId },
    });
    if (!session) {
      throw new NotFoundException('Academic session not found.');
    }

    //Check duplicate term number within the same session
    const existingTerm = await this.prisma.TermRecord.findFirst({
      where: {
        termNumber: dto.termNumber,
        sessionId: dto.sessionId,
      },
    });
    if (existingTerm) {
      throw new ConflictException('An academic term with the same number already exists in this session.');
    }

    //Ensure term dates are within session dates
    if (new Date(dto.startDate) < new Date(session.startDate) || new Date(dto.endDate) > new Date(session.endDate)) {
      throw new ConflictException('Term dates must be within the academic session dates.');
    }

    //Ensure max of 3 terms per session
    const termCount = await this.prisma.TermRecord.count({
      where: { sessionId: dto.sessionId },
    });
    if (termCount >= 3) {
      throw new ConflictException('An academic session can only have a maximum of 3 terms.');
    }

    const newTerm = await this.prisma.TermRecord.create({
      data: {
        termNumber: dto.termNumber,
        startDate: dto.startDate,
        endDate: dto.endDate,
        sessionId: dto.sessionId,
      },
    });
    return newTerm;
  }

  /** GET /academic-sessions/:id/terms/active Retrieve the active academic term */
  async getActiveTerm() {
    const activeTerm = await this.prisma.TermRecord.findFirst({
      where: { isActive: true },
    });
    if (!activeTerm) {
      throw new NotFoundException('No active academic term found.');
    }
    return activeTerm;
  }

  /** PATCH /academic-sessions/:id/terms/active Activate the active academic term */
  async activateTerm(termId: string) {
    const term = await this.prisma.TermRecord.findUnique({
      where: { termId },
    });
    if (!term) {
      throw new NotFoundException('Academic term not found.');
    }
    return this.prisma.TermRecord.update({
      where: { termId },
      data: { isActive: true },
    });
  }

  /** PATCH /academic-sessions/:id/terms Update academic term dates */
  async updateTermDates(termId: string, dto: UpdateTermDto) {
    const term = await this.prisma.TermRecord.findUnique({
      where: { termId },
    });
    if (!term) {
      throw new NotFoundException('Academic term not found.');
    }
    return this.prisma.TermRecord.update({
      where: { termId },
      data: {
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });
  }
}