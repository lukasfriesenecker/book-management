import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/user/user.entity';

export const ROLE_KEY = 'role';
export const RequiredRole = (role: Role) => SetMetadata(ROLE_KEY, role);
