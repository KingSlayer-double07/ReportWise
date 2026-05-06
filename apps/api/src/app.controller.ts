import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './app/dtos/health-response.dto.js';
import { Public } from './common/public.decorator.js';

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
  @Public()
  health() {
    return {
      status: 'ok',
      app: 'ReportWise API',
      timestamp: new Date().toISOString(),
    };
  }
}
