import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { TenantModule } from './tenant/tenant.module.js';
import { TenantMiddleware } from './tenant/tenant.middleware.js';
import { PrismaModule } from './common/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SuperAdminModule } from './super-admin/super-admin.module.js';
import { SchoolConfigModule } from './school-config/school-config.module.js';
import { AcademicSessionModule } from './academic-session/academic-session.module.js';
import { ClassSubjectModule } from './class-subject/class-subject.module.js';
import { GradingModule } from './grading/grading.module.js';

@Module({
  controllers: [AppController],
  imports: [
    PrismaModule,
    TenantModule,
    AuthModule,
    SuperAdminModule,
    SchoolConfigModule,
    AcademicSessionModule,
    ClassSubjectModule,
    GradingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*'); // Apply to all routes, guards will handle auth/tenant checks
  }
}
