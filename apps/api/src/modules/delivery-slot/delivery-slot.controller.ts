import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { DeliverySlotService } from './delivery-slot.service';
import { FindDeliverySlotDto, FindMissedSlotDto } from './dto/slot-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';

@Controller('delivery-slots')
@UseInterceptors(AuditLogInterceptor)
export class DeliverySlotController {
  constructor(private readonly deliverySlotService: DeliverySlotService) {}

  @Get('monitor')
  findTodayMonitor() {
    return this.deliverySlotService.findTodayMonitor();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: FindDeliverySlotDto) {
    return this.deliverySlotService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('missed')
  findMissed(@Query() query: FindMissedSlotDto) {
    return this.deliverySlotService.findMissed(query);
  }
}
