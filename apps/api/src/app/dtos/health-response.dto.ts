import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    example: 'ok',
  })
  status: string;

  @ApiProperty({
    example: 'ReportWise API',
  })
  app: string;

  @ApiProperty({
    example: '2026-04-25T00:00:00.000Z',
  })
  timestamp: string;
}
