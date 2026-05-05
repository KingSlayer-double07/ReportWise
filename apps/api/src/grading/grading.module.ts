import { Module } from '@nestjs/common';
import { GradingService } from './grading.service.js';

@Module({
  providers: [GradingService],
  exports: [GradingService],  // exported so ScoreModule can inject it
})
export class GradingModule {}