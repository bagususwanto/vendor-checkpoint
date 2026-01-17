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
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { VerifyCheckInDto } from './dto/verify-check-in.dto';
import { CheckoutCheckInDto } from './dto/checkout-check-in.dto';
import { getRequestInfo } from 'src/common/utils/request-info.util';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  // PUBLIC - Vendor submit check-in tanpa login
  @Post()
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
  @UseGuards(JwtAuthGuard)
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
  verify(@Body() verifyCheckInDto: VerifyCheckInDto, @Req() req: Request) {
    const requestInfo = getRequestInfo(req);
    return this.checkInService.verifyCheckIn(verifyCheckInDto, requestInfo);
  }

  // PROTECTED - Staff only
  @UseGuards(JwtAuthGuard)
  @Patch('/checkout')
  checkout(@Body() checkoutDto: CheckoutCheckInDto, @Req() req: Request) {
    const requestInfo = getRequestInfo(req);
    return this.checkInService.checkoutEntry(checkoutDto, requestInfo);
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
