import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 1, required: false })
  id?: number;

  @ApiProperty({ example: 'maxmustermann' })
  username: string;

  @ApiProperty({ example: 'test@gmx.at' })
  email: string;

  @ApiProperty({ example: 'password', required: false})
  password?: string;

  @ApiProperty({ example: Role.USER, required: false })
  role?: Role;
}
