import { Injectable, Inject, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
    constructor(
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    getSchoolSlug(): string | null {
        return this.request['tenantSlug'] ?? null;
    }

    getSchemaName(): string | null {
        const slug = this.getSchoolSlug();
        return slug ? `school_${slug}` : null;
    }

    requireSlug(): string {
        const slug = this.getSchoolSlug();
        if (!slug) throw new Error('No tenant slug found on request');
        return slug;
    }
}