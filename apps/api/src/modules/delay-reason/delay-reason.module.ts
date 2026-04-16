import { Module } from '@nestjs/common';
import { DelayReasonService } from './delay-reason.service';
import { DelayReasonController } from './delay-reason.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [DelayReasonController],
  providers: [DelayReasonService],
})
export class DelayReasonModule {}
