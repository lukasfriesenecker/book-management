import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true; // kein @Roles Decorator -> keine Rollen-Einschränkung
    const req = context.switchToHttp().getRequest<Request>();
    const user: any = (req as any).user;
    console.error(user);
    if (!user) return false;
    const userRoles: string[] = user.realm_access?.roles || []; 
    const hasAllRoles = requiredRoles.every(role => userRoles.includes(role));
    if (!hasAllRoles) throw new ForbiddenException('Insufficient roles');
    return true;
  }
}
