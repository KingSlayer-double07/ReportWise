import { Module } from "@nestjs/common";
import { TenantMiddleware } from "./tenant.middleware.js";
import { JwtModule } from "@nestjs/jwt";
import { TenantContextService } from "./tenant-context.service.js";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [TenantMiddleware, TenantContextService],
    exports: [TenantContextService],
})
export class TenantModule {}