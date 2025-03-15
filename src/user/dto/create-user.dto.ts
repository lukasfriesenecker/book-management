import { Role } from '../user.entity';

export class CreateUserDto {
  id?: number;
  username: string;
  password: string;
  role?: Role;
}
