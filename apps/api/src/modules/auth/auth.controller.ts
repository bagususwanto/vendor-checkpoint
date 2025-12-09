import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN -> forward ke external API
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  // REFRESH TOKEN -> forward ke external API
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  // LOGOUT -> forward ke external API
  @Post('logout')
  async logout(@Body() body: { accessToken: string }) {
    return this.authService.logout(body.accessToken);
  }

  // PROFILE -> protected route untuk debugging
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WAREHOUSE_STAFF, UserRole.GROUP_LEADER, UserRole.SUPER_ADMIN)
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
