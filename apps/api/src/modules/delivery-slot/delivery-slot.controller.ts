import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { DeliverySlotService } from './delivery-slot.service';
import { FindDeliverySlotDto, FindMissedSlotDto } from './dto/slot-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@repo/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('delivery-slots')
@UseInterceptors(AuditLogInterceptor)
export class DeliverySlotController {
  constructor(private readonly deliverySlotService: DeliverySlotService) {}

  @Get('monitor')
  findTodayMonitor() {
    return this.deliverySlotService.findTodayMonitor();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.GROUP_HEAD,
    UserRole.LINE_HEAD,
    UserRole.SECTION_HEAD,
    UserRole.WAREHOUSE_STAFF,
    UserRole.WAREHOUSE_MEMBER,
  )
  @Get()
  findAll(@Query() query: FindDeliverySlotDto) {
    return this.deliverySlotService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.GROUP_HEAD,
    UserRole.LINE_HEAD,
    UserRole.SECTION_HEAD,
    UserRole.WAREHOUSE_STAFF,
    UserRole.WAREHOUSE_MEMBER,
  )
  @Get('missed')
  findMissed(@Query() query: FindMissedSlotDto) {
    return this.deliverySlotService.findMissed(query);
  }
}
