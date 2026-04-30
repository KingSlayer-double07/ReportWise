import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "@reportwise/shared";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        const slugHeader = req.headers['x-school-slug'] as string;

        let tenantSlug: string | null = null;
        let payload: JwtPayload | null = null;

        // If authHeader exists, try to extract tenantSlug from JWT token
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            try {
                payload = this.jwtService.verify<JwtPayload>(token);
                tenantSlug = payload.schoolSlug;
                console.log('TenantMiddleware: Extracted schoolSlug:', tenantSlug ? `schoolSlug=${tenantSlug}` : 'no schoolSlug in token');
            } catch {
                throw new UnauthorizedException('Invalid authorization token');
            }
        } else {
            // If no token, check for x-school-slug header (for non-authenticated routes)
            if (slugHeader) {
                tenantSlug = slugHeader;
                console.log('TenantMiddleware: Using schoolSlug from header:', tenantSlug);
            }
        }
        
        // Super Admin bypasses tenant checks
        if (!tenantSlug) {
            req['tenantSlug'] = null;
            return next();
        }


        // Validate slug format - only allows lowercase letters, numbers, underscores
        if (tenantSlug && !/^[a-z0-9_]+$/.test(tenantSlug)) {
            throw new UnauthorizedException('Invalid school identifier format');
        }

        req['tenantSlug'] = tenantSlug;

        next();
    }
}