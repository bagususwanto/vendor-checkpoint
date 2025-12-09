import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(dto: LoginDto) {
    try {
      const resp$ = this.httpService.post(
        `${process.env.EXTERNAL_API_URL}/login`,
        dto,
      );
      const { data } = await lastValueFrom(resp$);
      // Expect external API returns { accessToken, refreshToken }
      return data;
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const resp$ = this.httpService.post(
        `${process.env.EXTERNAL_API_URL}/refresh`,
        { refreshToken },
      );
      const { data } = await lastValueFrom(resp$);
      return data;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(token: string) {
    try {
      const resp$ = this.httpService.post(
        `${process.env.EXTERNAL_API_URL}/logout`,
        { token },
      );
      const { data } = await lastValueFrom(resp$);
      return data;
    } catch (err) {
      // best-effort; don't leak remote errors
      return { success: false };
    }
  }
}
