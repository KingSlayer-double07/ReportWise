import { ApiProperty } from '@nestjs/swagger';

class AuthUserDto {
  @ApiProperty({
    example: 'c1d67f7b-8b5a-4fd7-8d6f-ccf6f4d4f444',
  })
  id: string;

  @ApiProperty({
    example: 'ADMIN',
  })
  role: string;

  @ApiProperty({
    example: 'Test Admin',
  })
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token for authenticated API requests.',
  })
  accessToken: string;

  @ApiProperty({
    type: AuthUserDto,
  })
  user: AuthUserDto;
}
