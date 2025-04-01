import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Role, User } from 'src/user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req.user = {
      id: 1,
      username: 'Lukas Friesenecker',
      password: 'geheim',
      role: Role.USER,
    };
    next();
  }
}
