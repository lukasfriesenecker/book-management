import { SetMetadata } from '@nestjs/common';
export const RequiredRole = (...roles: string[]) => SetMetadata('roles', roles);

