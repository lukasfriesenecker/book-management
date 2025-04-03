import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 1, required: false })
  id?: number;

  @ApiProperty({ example: 'maxmustermann' })
  username: string;

  @ApiProperty({ example: 'password' })
  password: string;

  @ApiProperty({ example: Role.ADMIN, required: false })
  role?: Role;
}
