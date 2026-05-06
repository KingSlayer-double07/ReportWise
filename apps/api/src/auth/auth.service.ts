import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PRISMA_CLIENT } from '../common/prisma.module.js';
import { JwtPayload, Role } from '@reportwise/shared';
import { LoginDto, ChangePasswordDto, AuthResponse } from '@reportwise/shared';
import { withTenant, retry } from '../common/tenantHelper.utils.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(PRISMA_CLIENT) private readonly prisma: any,
  ) {}

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

    // Tenant login — search_path is set in withTenant, use raw SQL to ensure the tenant schema is targeted correctly
    console.log('Attempting to find user with identifier:', dto.identifier);
    const loginResults: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug,
        (tx) =>
          tx.$queryRaw`
          SELECT * FROM "User"
          WHERE email = ${dto.identifier}
            OR "staffId" = ${dto.identifier}
            OR "admissionNumber" = ${dto.identifier}
          LIMIT 1
        `,
      ),
    );

    const user = loginResults[0];
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
        name: user.name,
      },
    };
  }

  private async loginSuperAdmin(dto: LoginDto): Promise<AuthResponse> {
    // Super Admin lives in the public schema — query the public SuperAdmin model
    const admin: any = await retry(() =>
      this.prisma.superAdmin.findUnique({
        where: { email: dto.identifier },
      }),
    );

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
  async changePassword(
    userId: string,
    schoolSlug: string | null,
    dto: ChangePasswordDto,
  ): Promise<void> {
    console.log(`Changing password for user ${userId}`);

    const passwordResults: any[] = await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug as string,
        (tx) =>
          tx.$queryRaw`
          SELECT * FROM "User"
          WHERE id = ${userId}
          LIMIT 1
        `,
      ),
    );
    const user = passwordResults[0];
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await retry(() =>
      withTenant(
        this.prisma,
        schoolSlug as string,
        (tx) =>
          tx.$executeRaw`
          UPDATE "User"
          SET password = ${hashed}, "mustChangePassword" = false
          WHERE id = ${userId}
        `,
      ),
    );
  }
}
