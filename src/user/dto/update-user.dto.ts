import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../user.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'newpassword', required: false })
  password?: string;

  @ApiProperty({ example: Role.ADMIN, required: false })
  role?: Role;
}
