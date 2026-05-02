import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { JwtPayload, Role } from '@reportwise/shared';
import { LoginDto, ChangePasswordDto, AuthResponse } from '@reportwise/shared';
import { withTenant } from '../common/tenantHelper.utils.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

  async retry<T>(fn: () => Promise<T>, retries = 3) {
    try {
      return await fn();
    } catch (err: any) {
      if (retries > 0 && err.code === 'EAI_AGAIN') {
        await new Promise((res) => setTimeout(res, 1000));
        return this.retry(fn, retries - 1);
      }
      throw err;
    }
  }

  /**
   * LOGIN
   * identifier = email (Admin) | staffId (Teacher) | admissionNumber (Student)
   * schoolSlug is extracted from the request by the controller (from subdomain or header)
   */
  async login(dto: LoginDto, schoolSlug: string | null): Promise<AuthResponse> {
    // Super Admin login — query public schema directly
    if (!schoolSlug) {
      return this.loginSuperAdmin(dto);
    }

    // Tenant login — search_path already set by middleware
    console.log('Attempting to find user with identifier:', dto.identifier);
    const results = await this.retry(() =>
      withTenant(this.prisma, schoolSlug, (tx) =>
        tx.$queryRawUnsafe(`
          SELECT * FROM "User"
          WHERE email = '${dto.identifier}'
          OR "staffId" = '${dto.identifier}'
          OR "admissionNumber" = '${dto.identifier}'
          LIMIT 1
          `),
      ),
    );

    const user = results[0];

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Wrong Password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      schoolSlug: schoolSlug,
      mustChangePassword: user.mustChangePassword,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        role: user.role,
        name: '', // populated from profile join in a real endpoint
      },
    };
  }

  private async loginSuperAdmin(dto: LoginDto): Promise<AuthResponse> {
    // Super Admin lives in the public schema — use $queryRaw to bypass search_path
    const results = await this.retry(() => 
      this.prisma.$queryRaw`
        SELECT * FROM public."SuperAdmin" WHERE email = ${dto.identifier} LIMIT 1`
    );
    const admin = results[0];

    if (!admin) throw new UnauthorizedException('User Not Found');

    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Wrong Password');

    const payload: JwtPayload = {
      sub: admin.id,
      role: Role.SUPER_ADMIN,
      schoolSlug: null, // deliberately null — middleware skips search_path injection
      mustChangePassword: false, // Super Admins don't need a mustChangePassword flag
    };

    console.log('Super Admin login successful:', {
      email: dto.identifier,
      id: admin.id,
    });

    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: admin.id, role: Role.SUPER_ADMIN, name: 'Super Admin' },
    };
  }

  /** CHANGE PASSWORD — works for all tenant roles */
  async changePassword(userId: string, schoolSlug: string | null, dto: ChangePasswordDto): Promise<void> {
    console.log(`Changing password for user ${userId}`);
    
    const results = await this.retry(() => 
      withTenant(this.prisma, schoolSlug as string, (tx) =>
        tx.$queryRaw`
          SELECT * FROM "User"
          WHERE id = ${userId}
          LIMIT 1
          `
      ),
    );
    
    const user = results[0];
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.retry(() => 
      withTenant(this.prisma, schoolSlug as string, (tx) =>
        tx.$executeRaw`UPDATE "User" SET password = ${hashed}, "mustChangePassword" = false WHERE id = ${userId}`
      ),
    );
  }
}
