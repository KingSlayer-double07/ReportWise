import { Controller, Post, Get, Body, Headers, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { LoginDto, ChangePasswordDto } from '@reportwise/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Admin / Teacher / Student login */
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Headers('x-school-slug') schoolSlug: string,
  ) {
    return this.authService.login(dto, schoolSlug);
  }

  /** Super Admin login — no school slug */
  @Post('super/login')
  superLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto, null);
  }

  /** Change password — all authenticated roles */
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto);
  }

  /** Get current authenticated user */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return req.user; // Returns the JWT payload: { sub, role, schoolSlug }
  }
}