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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';


import type { LoginDto, ChangePasswordDto } from '@reportwise/shared';
import { ApiLoginDto, ApiChangePasswordDto } from '../apiDtos/index.js';

// Optional response DTOs (only if you actually use them)
import { AuthResponseDto } from './dtos/auth-response.dto.js';
import { MeResponseDto } from './dtos/me-response.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /** Admin / Teacher / Student login */
  @ApiOperation({
    summary: 'Login as Admin, Teacher, or Student',
    description:
      'Authenticates a tenant user using email, staffId, or admission number.',
  })
  @ApiHeader({
    name: 'x-school-slug',
    description: 'School slug for tenant login (omit for Super Admin)',
    required: false,
  })
  @ApiBody({ type: ApiLoginDto })
  @ApiCreatedResponse({
    description: 'Authentication successful.',
    type: AuthResponseDto,
  })
  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful login returns JWT token and user info.' })
  login(
    @Body() dto: LoginDto,
    @Headers('x-school-slug') schoolSlug: string,
  ) {
    return this.authService.login(dto, schoolSlug);
  }

  /** Super Admin login */
  @ApiOperation({
    summary: 'Login as Super Admin',
  })
  @ApiBody({ type: ApiLoginDto })
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
  @ApiBody({ type: ApiChangePasswordDto })
  @ApiNoContentResponse({
    description: 'Password changed successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    console.log(`Received password change request for user ${req.user.schoolSlug}/${req.user.sub}`);
    return this.authService.changePassword(req.user.sub, req.user.schoolSlug, dto);
  }

  /** Get current authenticated user */
  @ApiOperation({
    summary: 'Get current authenticated user',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Current JWT payload.',
    type: MeResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return req.user;
  }
}
