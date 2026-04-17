import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { TenantModule } from './tenant/tenant.module';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [AppController],
  imports: [PrismaModule, TenantModule, AuthModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(TenantMiddleware)
    .forRoutes('*'); // Apply to all routes, guards will handle auth/tenant checks
  }
}
