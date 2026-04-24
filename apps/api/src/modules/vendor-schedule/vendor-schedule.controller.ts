import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  Res,
  Header,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { VendorScheduleService } from './vendor-schedule.service';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuditLog } from 'src/common/decorators/audit.decorator';
import { AuditLogInterceptor } from 'src/common/interceptors/audit.interceptor';

@Controller('vendor-schedules')
@UseInterceptors(AuditLogInterceptor)
export class VendorScheduleController {
  constructor(private readonly vendorScheduleService: VendorScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @AuditLog({
    actionType: 'VENDOR_SCHEDULE_CREATE',
    actionDescription: 'Vendor schedule created',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res,
    }),
  })
  create(@Body() createVendorScheduleDto: CreateVendorScheduleDto) {
    return this.vendorScheduleService.create(createVendorScheduleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @AuditLog({
    actionType: 'VENDOR_SCHEDULE_UPLOAD',
    actionDescription: 'Vendor schedule uploaded via Excel',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      result: res,
    }),
  })
  async uploadExcel(@UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string }) {
    return this.vendorScheduleService.uploadExcel(file.buffer);
  }

  @Get('template')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=template_jadwal_vendor.xlsx')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.vendorScheduleService.downloadTemplate();
    res.send(buffer);
  }

  @Get()
  findAll(
    @Query() query: import('src/common/dto/paginated-params.dto').PaginatedParamsDto,
    @Query('vendor_id') vendor_id?: string,
    @Query('day_of_week') day_of_week?: string,
  ) {
    return this.vendorScheduleService.findAll(
      query,
      vendor_id ? +vendor_id : undefined,
      day_of_week ? +day_of_week : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorScheduleService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @AuditLog({
    actionType: 'VENDOR_SCHEDULE_UPDATE',
    actionDescription: 'Vendor schedule updated',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      new_value: res.new_value,
    }),
  })
  update(
    @Param('id') id: string,
    @Body() updateVendorScheduleDto: UpdateVendorScheduleDto,
  ) {
    return this.vendorScheduleService.update(+id, updateVendorScheduleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @AuditLog({
    actionType: 'VENDOR_SCHEDULE_DELETE',
    actionDescription: 'Vendor schedule deleted',
    buildDetails: (req, res) => ({
      user_id: req.user?.userId,
      old_value: res,
    }),
  })
  remove(@Param('id') id: string) {
    return this.vendorScheduleService.remove(+id);
  }
}
