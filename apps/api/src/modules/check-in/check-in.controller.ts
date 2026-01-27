import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { VerifyCheckInDto } from './dto/verify-check-in.dto';
import { CheckoutCheckInDto } from './dto/checkout-check-in.dto';
import { getRequestInfo } from 'src/common/utils/request-info.util';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';
import { QueueStatus } from '@repo/types';

@Controller('check-in')
@UseInterceptors(AuditLogInterceptor)
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  // PUBLIC - Vendor submit check-in tanpa login
  @Post()
  @AuditLog({
    actionType: 'CHECKIN_CREATE',
    actionDescription: 'Check-in entry created',
    buildDetails: (req, res) => ({
      entry_id: res.entry_id,
      new_value: {
        queue_number: res.queue_number,
        vendor_id: req.body.vendor_id,
        driver_name: req.body.driver_name,
      },
    }),
  })
  create(@Body() createCheckInDto: CreateCheckInDto, @Req() req: Request) {
    const requestInfo = getRequestInfo(req);
    return this.checkInService.create(createCheckInDto, requestInfo);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.checkInService.findAll();
  }

  // PUBLIC - Vendor cek status queue
  @Get('/queue/:queueNumber')
  findByQueue(@Param('queueNumber') queueNumber: string) {
    return this.checkInService.findByQueue(queueNumber);
  }

  // PROTECTED - Staff only
  // PUBLIC - Display screen (no auth required)
  @Get('/active')
  findActiveQueue(@Query() query: PaginatedParamsDto) {
    return this.checkInService.findActiveQueue(query);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Get('/verification-list')
  findVerificationList(@Query() query: PaginatedParamsDto) {
    return this.checkInService.findVerificationList(query);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Get('/verification-list/:queueNumber')
  findVerificationListById(@Param('queueNumber') queueNumber: string) {
    return this.checkInService.findVerificationListById(queueNumber);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Patch('/verify')
  @AuditLog({
    actionType: (req) =>
      req.body.action === 'APPROVE' ? 'CHECKIN_APPROVE' : 'CHECKIN_REJECT',
    actionDescription: (req) =>
      req.body.action === 'APPROVE'
        ? 'Check-in disetujui'
        : `Check-in ditolak: ${req.body.rejection_reason}`,
    buildDetails: (req, res) => ({
      entry_id: res.entry_id,
      user_id: res.user_id,
      old_value: { status: QueueStatus.MENUNGGU },
      new_value: {
        status: res.status,
        rejection_reason:
          req.body.action === 'REJECT' ? req.body.rejection_reason : null,
      },
    }),
  })
  verify(@Body() verifyCheckInDto: VerifyCheckInDto, @Req() req: any) {
    const requestInfo = getRequestInfo(req);
    const userId = req.user.userId;
    return this.checkInService.verifyCheckIn(
      verifyCheckInDto,
      requestInfo,
      userId,
    );
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Patch('/checkout')
  @AuditLog({
    actionType: 'CHECKIN_CHECKOUT',
    actionDescription: 'Check-in checkout berhasil',
    buildDetails: (req, res) => ({
      entry_id: res.entry_id,
      user_id: res.user_id,
      old_value: { status: QueueStatus.DISETUJUI },
      new_value: {
        status: QueueStatus.SELESAI,
        checkout_time: res.checkout_time,
        duration_minutes: res.duration_minutes,
      },
    }),
  })
  checkout(@Body() checkoutDto: CheckoutCheckInDto, @Req() req: any) {
    const requestInfo = getRequestInfo(req);
    const userId = req.user.userId;
    return this.checkInService.checkoutEntry(checkoutDto, requestInfo, userId);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkInService.findOne(+id);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInService.update(+id, updateCheckInDto);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkInService.remove(+id);
  }
}
