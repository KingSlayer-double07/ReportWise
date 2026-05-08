import { Module } from '@nestjs/common';
import { AcademicSessionService } from './academic-session.service.js';
import { AcademicSessionController } from './academic-session.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [AcademicSessionService],
  controllers: [AcademicSessionController],
  exports: [AcademicSessionService], // exported so SchoolConfigService can inject it for term/session info
})
export class AcademicSessionModule {}
