import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from '../../common/decorators/roles.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN -> forward ke external API
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);

    // Forward Set-Cookie header from external API to frontend
    if (result.setCookieHeader) {
      result.setCookieHeader.forEach((cookie) => {
        res.append('Set-Cookie', cookie);
      });
    }

    return { accessToken: result.accessToken };
  }

  // REFRESH TOKEN -> forward ke external API
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Forward cookies from frontend request to external API
    const cookies = req.headers.cookie || '';
    const result = await this.authService.refresh(cookies);

    // Forward Set-Cookie header from external API to frontend
    if (result.setCookieHeader) {
      result.setCookieHeader.forEach((cookie) => {
        res.append('Set-Cookie', cookie);
      });
    }

    return { accessToken: result.accessToken };
  }

  // LOGOUT -> forward ke external API
  @Post('logout')
  async logout(@Req() req: Request) {
    const cookies = req.headers.cookie || '';
    return this.authService.logout(cookies);
  }

  // PROFILE -> protected route untuk debugging
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WAREHOUSE_STAFF, UserRole.GROUP_LEADER, UserRole.SUPER_ADMIN)
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
