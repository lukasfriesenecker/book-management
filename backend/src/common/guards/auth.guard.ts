import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private client = jwksClient({
    jwksUri: 'http://keycloak:8080/realms/BookManagement/protocol/openid-connect/certs',
  });

  private getKey(header: jwt.JwtHeader): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!header.kid) {
        return reject(new Error('No KID in token header'));
      }

      this.client.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
          return reject(new Error('Unable to get signing key'));
        }

        const signingKey =
          (key as jwksClient.CertSigningKey).publicKey ||
          (key as jwksClient.RsaSigningKey).rsaPublicKey;

        if (!signingKey) {
          return reject(new Error('No public key found'));
        }

        resolve(signingKey);
      });
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true; 
    }

    const req = context.switchToHttp().getRequest<Request>();
    const token = (req as any).cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('No auth token');
    }

    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(
          token,
          (header, callback) => {
            this.getKey(header)
              .then((key) => callback(null, key))
              .catch((err) => callback(err, undefined));
          },
          { algorithms: ['RS256'] },
          (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
          }
        );
      });
      (req as any).user = decoded;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
