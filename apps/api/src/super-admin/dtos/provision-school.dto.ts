import { ApiProperty } from '@nestjs/swagger';

export class ProvisionSchoolDto {
  @ApiProperty({
    example: 'Greenfield Academy',
    description: 'Human-readable name of the school being provisioned.',
  })
  name!: string;

  @ApiProperty({
    example: 'greenfield',
    description:
      'Tenant slug used to derive the PostgreSQL schema name, for example school_greenfield.',
  })
  slug!: string;

  @ApiProperty({
    example: 'admin@greenfield.edu.ng',
    description: 'Primary admin email to associate with the school record.',
  })
  adminEmail!: string;

  @ApiProperty({
    example: 'SMALL',
    description:
      'Provisioning plan tier. Current manual provisioning script accepts SMALL, MEDIUM, LARGE, ENTERPRISE, or COMPLIMENTARY.',
  })
  planTier!: string;
}
