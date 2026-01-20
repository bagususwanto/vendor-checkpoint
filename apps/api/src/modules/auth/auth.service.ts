import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';

export interface AuthResponse {
  accessToken: string;
  setCookieHeader?: string[];
}

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    try {
      const resp$ = this.httpService.post(
        `${process.env.EXTERNAL_API_URL}/login`,
        dto,
      );
      const response = await lastValueFrom(resp$);

      // Extract Set-Cookie header from external API response
      const setCookieHeader = response.headers['set-cookie'];

      return {
        accessToken: response.data.accessToken,
        setCookieHeader,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refresh(cookies: string): Promise<AuthResponse> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Cookie: cookies, // Forward cookies to external API
        },
      };

      const resp$ = this.httpService.get(
        `${process.env.EXTERNAL_API_URL}/token`,
        config,
      );

      const response = await lastValueFrom(resp$);

      // Extract Set-Cookie header from external API response
      const setCookieHeader = response.headers['set-cookie'];

      return {
        accessToken: response.data.accessToken,
        setCookieHeader,
      };
    } catch (err: any) {
      console.error('Refresh error:', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(
    cookies: string,
  ): Promise<{ success: boolean; setCookieHeader?: string[] }> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Cookie: cookies,
        },
      };

      const resp$ = this.httpService.delete(
        `${process.env.EXTERNAL_API_URL}/logout`,
        config,
      );
      const response = await lastValueFrom(resp$);

      const setCookieHeader = response.headers['set-cookie'];

      return { success: true, setCookieHeader };
    } catch (err) {
      // best-effort; don't leak remote errors
      return { success: false };
    }
  }
}
