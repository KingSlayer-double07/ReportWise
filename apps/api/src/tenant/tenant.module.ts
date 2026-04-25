import { Module } from "@nestjs/common";
import { TenantMiddleware } from "./tenant.middleware.js";
import { JwtModule } from "@nestjs/jwt";
import { TenantContextService } from "./tenant-context.service.js";
import { TenantProvisioningService } from "./tenant-provisioning.service.js";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    providers: [TenantMiddleware, TenantContextService, TenantProvisioningService],
    exports: [TenantContextService, TenantProvisioningService],
})
export class TenantModule {}
