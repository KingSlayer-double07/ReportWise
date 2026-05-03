import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SchoolConfigService } from './school-config.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { Role } from '@reportwise/shared';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateSchoolConfigDto } from '../apiDtos/index.js';

@ApiTags('School Config')
@Controller('school-config')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolConfigController {
  constructor(private readonly svc: SchoolConfigService) {}

  @ApiOperation({
    summary: 'Get School Configuration',
    description: 'Retrieves the current school configuration settings.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns the current school configuration.' })
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getConfig() {
    return this.svc.getConfig();
  }

  @ApiOperation({
    summary: 'Update School Configuration',
    description: 'Updates the school configuration settings.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateSchoolConfigDto })
  @ApiResponse({ status: 200, description: 'Returns the updated school configuration.' })
  @Patch()
  @Roles(Role.ADMIN)
  updateConfig(@Body() dto: UpdateSchoolConfigDto) {
    return this.svc.updateConfig(dto);
  }
}