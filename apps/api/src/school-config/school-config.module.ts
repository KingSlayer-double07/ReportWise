import { Module } from '@nestjs/common';
import { SchoolConfigService } from './school-config.service.js';
import { SchoolConfigController } from './school-config.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [SchoolConfigService],
  controllers: [SchoolConfigController],
  exports: [SchoolConfigService],  // exported so GradingService can inject it
})
export class SchoolConfigModule {}