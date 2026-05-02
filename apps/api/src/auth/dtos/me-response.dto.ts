import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({
    example: 'c1d67f7b-8b5a-4fd7-8d6f-ccf6f4d4f444',
  })
  sub!: string;

  @ApiProperty({
    example: 'ADMIN',
  })
  role!: string;

  @ApiProperty({
    example: 'greenfield',
    nullable: true,
  })
  schoolSlug!: string | null;

  @ApiProperty({
    example: true,
  })
  mustChangePassword!: boolean;
}
