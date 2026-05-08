import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { TenantModule } from '../tenant/tenant.module.js';
import { SuperAdminController } from './super-admin.controller.js';

@Module({
  imports: [AuthModule, TenantModule],
  controllers: [SuperAdminController],
})
export class SuperAdminModule {}
