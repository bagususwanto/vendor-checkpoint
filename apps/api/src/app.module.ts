import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [AuthModule, VendorModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
