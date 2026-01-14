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
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { VerifyCheckInDto } from './dto/verify-check-in.dto';
import { CheckoutCheckInDto } from './dto/checkout-check-in.dto';
import { getRequestInfo } from 'src/common/utils/request-info.util';
import { PaginatedParamsDto } from 'src/common/dto/paginated-params.dto';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  create(@Body() createCheckInDto: CreateCheckInDto, @Req() req: Request) {
    const requestInfo = getRequestInfo(req);

    return this.checkInService.create(createCheckInDto, requestInfo);
  }

  @Get()
  findAll() {
    return this.checkInService.findAll();
  }

  @Get('/queue/:queueNumber')
  findByQueue(@Param('queueNumber') queueNumber: string) {
    return this.checkInService.findByQueue(queueNumber);
  }

  @Get('/active')
  findActiveQueue(@Query() query: PaginatedParamsDto) {
    return this.checkInService.findActiveQueue(query);
  }

  @Get('/verification-list')
  findVerificationList(@Query() query: PaginatedParamsDto) {
    return this.checkInService.findVerificationList(query);
  }

  @Get('/verification-list/:queueNumber')
  findVerificationListById(@Param('queueNumber') queueNumber: string) {
    return this.checkInService.findVerificationListById(queueNumber);
  }

  @Patch('/verify')
  verify(@Body() verifyCheckInDto: VerifyCheckInDto, @Req() req: Request) {
    const requestInfo = getRequestInfo(req);
    return this.checkInService.verifyCheckIn(verifyCheckInDto, requestInfo);
  }

  @Patch('/checkout')
  checkout(@Body() checkoutDto: CheckoutCheckInDto, @Req() req: Request) {
    const requestInfo = getRequestInfo(req);
    return this.checkInService.checkoutEntry(checkoutDto, requestInfo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkInService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInService.update(+id, updateCheckInDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkInService.remove(+id);
  }
}
