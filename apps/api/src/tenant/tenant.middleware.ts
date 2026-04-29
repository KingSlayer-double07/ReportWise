import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";
import { Client } from "pg";
import { JwtPayload } from "@reportwise/shared";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

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

        // Set search_path for the request using a raw pg client connection
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
        });
        try {
            await client.connect();
            await client.query(`SET search_path TO "${schemaName}", public`);
            console.log(`TenantMiddleware: Set search_path to ${schemaName} for request with schoolSlug ${payload.schoolSlug}`);
            req['tenantSlug'] = payload.schoolSlug;
            req['tenantClient'] = client; // Attach the client to the request for cleanup
        } catch (err) {
            await client.end().catch(() => {}); // Ensure client is closed on error
            throw err;
        }

        // Clean up the client after the response is finished
        res.on('finish', () => client.end().catch(() => {}));
        res.on('close', () => client.end().catch(() => {}));

        next();
    }
}