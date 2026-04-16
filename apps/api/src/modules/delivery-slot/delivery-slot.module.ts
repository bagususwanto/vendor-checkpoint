import { Module } from '@nestjs/common';
import { DeliverySlotService } from './delivery-slot.service';
import { DeliverySlotController } from './delivery-slot.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [DeliverySlotController],
  providers: [DeliverySlotService],
})
export class DeliverySlotModule {}
