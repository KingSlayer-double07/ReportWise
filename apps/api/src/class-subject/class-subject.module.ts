import { Module } from '@nestjs/common';
import { ClassSubjectService } from './class-subject.service.js';
import {
  SubjectController,
  ClassSubjectController,
} from './class-subject.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [ClassSubjectService],
  controllers: [SubjectController, ClassSubjectController],
})
export class ClassSubjectModule {}
