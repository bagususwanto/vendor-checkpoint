import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { HttpModule } from '@nestjs/axios';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [HttpModule, AuditModule],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
