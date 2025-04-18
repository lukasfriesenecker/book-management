import { Controller, Get, Post, Req, Res, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';
import { Role } from '../user/user.entity';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Get('login')
  @Public()
  login(@Res() res: Response) {
    const authUrl = `http://localhost:8080/realms/BookManagement/protocol/openid-connect/auth` +
      `?response_type=code&client_id=bookmanagement-app&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/callback')}` +
      `&scope=openid profile email`;
    return res.redirect(authUrl);
  }

  @Get('callback')
  @Public()
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokenData = await this.authService.exchangeCodeForToken(code);
      const { access_token, refresh_token, id_token } = tokenData;

      const decoded = jwt.decode(access_token) as any;
      const roles: string[] = decoded?.realm_access?.roles ?? [];

    await this.userService.createIfNotExists({
        email: decoded.email,
        username: decoded.preferred_username,
        role: roles.includes('ADMIN') ? Role.ADMIN : Role.USER
    });

    res.cookie('access_token', access_token, {
        httpOnly: true, sameSite: 'lax',  
    });
    res.cookie('refresh_token', refresh_token, {
        httpOnly: true, sameSite: 'lax',
    });
    res.cookie('id_token', id_token, {
        httpOnly: true, sameSite: 'lax',
    });

    } catch (e) {
      console.error('Tokenaustausch fehlgeschlagen:', e.response?.data || e.message);
      return res.redirect('http://localhost:3000/login-error');
    }
    return res.redirect('http://localhost:5173/');
  }

  @Get('me')
  async me(@Req() req: Request) {
    const user: any = req['user'];
    const userFromDb = await this.userService.findByEmail(user.email);

    if (!userFromDb) {
        throw new UnauthorizedException(`User with Email ${user.email} not existing`);
    }

    return {
      id: userFromDb.id,
      username: userFromDb.username,
      email: userFromDb.email,
      roles: user.realm_access?.roles || []
    };
  }

  @Post('refresh')
  @Public()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }
    try {
      const tokenData = await this.authService.refreshToken(refreshToken);
      res.cookie('access_token', tokenData.access_token, {
        httpOnly: true, sameSite: 'lax'
      });
      res.cookie('refresh_token', tokenData.refresh_token, {
        httpOnly: true, sameSite: 'lax'
      });
      res.cookie('id_token', tokenData.id_token, {
        httpOnly: true, sameSite: 'lax'
      })
      return res.json({ message: 'Token refreshed' });
    } catch (e) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return res.status(401).json({ message: 'Refresh failed, please log in again' });
    }
  }

  @Get('logout')
  logout(@Res() res: Response, @Req() req: Request) {

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
     res.clearCookie('id_token');

     //Kill keycloak session
     const idToken = req.cookies['id_token'];
     if(idToken) {
       const logoutUrl = 'http://localhost:8080/realms/BookManagement/protocol/openid-connect/logout' +
         `?post_logout_redirect_uri=${encodeURIComponent('http://localhost:5173/')}` +
         `&id_token_hint=${idToken}`;
       return res.redirect(logoutUrl);
    }

    return res.redirect('http://localhost:5173/');
  }
}
