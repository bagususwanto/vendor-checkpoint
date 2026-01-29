import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from '../../common/decorators/roles.decorator';
import { Request, Response } from 'express';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@repo/types';

@Controller('auth')
@UseInterceptors(AuditLogInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN -> forward ke external API
  @Post('login')
  @AuditLog({
    actionType: 'USER_LOGIN',
    actionDescription: 'User logged in',
    buildDetails: (req, res) => {
      try {
        const decoded = jwtDecode<JwtPayload>(res.accessToken);
        return {
          user_id: decoded.userId,
          new_value: { username: req.body.username },
        };
      } catch (error) {
        return {
          new_value: { username: req.body.username },
        };
      }
    },
  })
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
  @AuditLog({
    actionType: 'USER_LOGOUT',
    actionDescription: 'User logged out',
    buildDetails: (req, res) => {
      try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const decoded = jwtDecode<JwtPayload>(token);
          return {
            user_id: decoded.userId,
          };
        }
        return {};
      } catch (error) {
        return {};
      }
    },
  })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.headers.cookie || '';
    const result = await this.authService.logout(cookies);

    if (result.setCookieHeader && result.setCookieHeader.length > 0) {
      result.setCookieHeader.forEach((cookie) => {
        res.append('Set-Cookie', cookie);
      });
    } else {
      // Fallback: Jika external API gagal atau tidak return header,
      // kita paksa hapus cookie di client agar user tetap ke-logout dari sisi frontend.
      res.clearCookie('refreshToken');
    }

    return result;
  }

  // PROFILE -> protected route untuk debugging
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WAREHOUSE_STAFF, UserRole.GROUP_LEADER, UserRole.SUPER_ADMIN)
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
