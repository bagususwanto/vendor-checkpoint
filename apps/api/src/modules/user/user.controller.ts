import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Controller('user')
@UseInterceptors(AuditLogInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  @AuditLog({
    actionType: 'USER_SYNC',
    actionDescription: 'Sync users from external API',
    buildDetails: (req, res) => ({
      new_value: res,
    }),
  })
  syncFromExternal() {
    return this.userService.syncFromExternalApi();
  }
}
