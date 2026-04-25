import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@reportwise/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { TenantProvisioningService } from '../tenant/tenant-provisioning.service.js';
import { ProvisionSchoolDto } from './dtos/provision-school.dto.js';

@ApiTags('Super Admin')
@ApiBearerAuth()
@Controller('super-admin')
export class SuperAdminController {
  constructor(
    private readonly tenantProvisioningService: TenantProvisioningService,
  ) {}

  @ApiOperation({
    summary: 'Provision a new school schema',
    description:
      'Allows a Super Admin to manually provision a new tenant schema and register the school.',
  })
  @ApiBody({ type: ProvisionSchoolDto })
  @Post('schools/provision')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  provisionSchool(@Body() dto: ProvisionSchoolDto) {
    return this.tenantProvisioningService.provisionSchool(dto);
  }
}
