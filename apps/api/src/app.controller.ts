import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './app/dtos/health-response.dto.js';

@ApiTags('System')
@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Health check',
  })
  @ApiOkResponse({
    description: 'API health status.',
    type: HealthResponseDto,
  })
  @Get('health')
  health() {
    return {
      status: 'ok',
      app: 'ReportWise API',
      timestamp: new Date().toISOString(),
    };
  }
}
