import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Role } from 'src/modules/user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req.user = {
      id: 1,
      username: 'maxmustermann',
      password: 'password',
      role: Role.ADMIN,
    };
    next();
  }
}
