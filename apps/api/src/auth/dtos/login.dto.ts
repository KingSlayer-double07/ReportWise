import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin@greenfield.edu.ng',
    description:
      'Login identifier. Use email for Admin, staffId for Teacher, or admission number for Student.',
  })
  identifier: string;

  @ApiProperty({
    example: 'TempPass123!',
    description: 'Plain-text password for the user account.',
  })
  password: string;
}
