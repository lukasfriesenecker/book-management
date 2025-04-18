import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  private KEYCLOAK_BASE_URL = 'http://keycloak:8080/realms/BookManagement/protocol/openid-connect';
  private CLIENT_ID = 'bookmanagement-app';
  private CLIENT_SECRET = 'GdV0g2pajU2nD2AITZiXwyw2jtk1NeUf';  
  private REDIRECT_URI = 'http://localhost:3000/api/auth/callback';

  async exchangeCodeForToken(code: string) {
    const tokenUrl = `${this.KEYCLOAK_BASE_URL}/token`;
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      redirect_uri: this.REDIRECT_URI,
    });

    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const tokenUrl = `${this.KEYCLOAK_BASE_URL}/token`;
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
    });
    try {
      const response = await axios.post(tokenUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return response.data; 
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }
}
