import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'TempPass123!',
    description: 'The user’s current password.',
  })
  currentPassword: string;

  @ApiProperty({
    example: 'NewSecurePass456!',
    description: 'The new password that will replace the current password.',
  })
  newPassword: string;
}
