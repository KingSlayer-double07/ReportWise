import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "@reportwise/shared";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        console.log('TenantMiddleware: Received request with Authorization header:', authHeader);

        // If no token, let the request through - guards will reject it later if necessary
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];

        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify<JwtPayload>(token);
        } catch {
            console.log('TenantMiddleware: Invalid authorization token');
            return next(); // Invalid token, let guards handle it
        }

        console.log('TenantMiddleware: School Slug is:', payload.schoolSlug);

        // Super Admin bypasses tenant checks
        if (!payload.schoolSlug) {
            req['tenantSlug'] = null;
            return next();
        }

        const schemaName = `school_${payload.schoolSlug}`;

        // Validate slug format - only allows lowercase letters, numbers, underscores
        if (!/^[a-z0-9_]+$/.test(payload.schoolSlug)) {
            throw new UnauthorizedException('Invalid school identifier format');
        }


        next();
    }
}