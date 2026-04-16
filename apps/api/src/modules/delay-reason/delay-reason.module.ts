import { Module } from '@nestjs/common';
import { DelayReasonService } from './delay-reason.service';
import { DelayReasonController } from './delay-reason.controller';

@Module({
  controllers: [DelayReasonController],
  providers: [DelayReasonService],
})
export class DelayReasonModule {}
