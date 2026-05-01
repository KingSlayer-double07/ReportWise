import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { TenantModule } from './tenant/tenant.module.js';
import { TenantMiddleware } from './tenant/tenant.middleware.js';
import { PrismaModule } from './common/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SuperAdminModule } from './super-admin/super-admin.module.js';

@Module({
  controllers: [AppController],
  imports: [PrismaModule, TenantModule, AuthModule, SuperAdminModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(TenantMiddleware)
    .forRoutes('*'); // Apply to all routes, guards will handle auth/tenant checks
  }
}
