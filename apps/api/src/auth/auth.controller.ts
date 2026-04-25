import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { ChangePasswordDto } from './dtos/change-password.dto.js';
import { AuthResponseDto } from './dtos/auth-response.dto.js';
import { LoginDto } from './dtos/login.dto.js';
import { MeResponseDto } from './dtos/me-response.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Admin / Teacher / Student login */
  @ApiOperation({
    summary: 'Login as Admin, Teacher, or Student',
    description:
      'Authenticates a tenant user using email, staffId, or admission number. Requires the school slug header.',
  })
  @ApiHeader({
    name: 'x-school-slug',
    description: 'Tenant school slug used to identify the target school.',
    required: true,
    example: 'greenfield',
  })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Authentication successful.',
    type: AuthResponseDto,
  })
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Headers('x-school-slug') schoolSlug: string,
  ) {
    return this.authService.login(dto, schoolSlug);
  }

  /** Super Admin login — no school slug */
  @ApiOperation({
    summary: 'Login as Super Admin',
    description:
      'Authenticates a platform-level Super Admin against the public schema.',
  })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Super Admin authentication successful.',
    type: AuthResponseDto,
  })
  @Post('super/login')
  superLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto, null);
  }

  /** Change password — all authenticated roles */
  @ApiOperation({
    summary: 'Change current user password',
  })
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiNoContentResponse({
    description: 'Password changed successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto);
  }

  /** Get current authenticated user */
  @ApiOperation({
    summary: 'Get the current authenticated user payload',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Current JWT payload.',
    type: MeResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return req.user; // Returns the JWT payload: { sub, role, schoolSlug }
  }
}
