import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PRISMA_CLIENT } from '../common/prisma.module';
import { JwtPayload, Role } from '@reportwise/shared';
import { LoginDto, ChangePasswordDto, AuthResponse } from '@reportwise/shared';

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

    // Tenant login — search_path already set by middleware
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email:           dto.identifier },
          { staffId:         dto.identifier },
          { admissionNumber: dto.identifier },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub:        user.id,
      role:       user.role,
      schoolSlug: schoolSlug,
      mustChangePassword: user.mustChangePassword,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id:   user.id,
        role: user.role,
        name: '', // populated from profile join in a real endpoint
      },
    };
  }

  private async loginSuperAdmin(dto: LoginDto): Promise<AuthResponse> {
    // Super Admin lives in the public schema — use $queryRaw to bypass search_path
    const results = await this.prisma.$queryRaw`
      SELECT * FROM public."SuperAdmin" WHERE email = ${dto.identifier} LIMIT 1
    `;
    const admin = results[0];

    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub:        admin.id,
      role:       Role.SUPER_ADMIN,
      schoolSlug: null, // deliberately null — middleware skips search_path injection
      mustChangePassword: false, // Super Admins don't need a mustChangePassword flag
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: admin.id, role: Role.SUPER_ADMIN, name: 'Super Admin' },
    };
  }

  /** CHANGE PASSWORD — works for all tenant roles */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        mustChangePassword: false,
      },
    });
  }
}