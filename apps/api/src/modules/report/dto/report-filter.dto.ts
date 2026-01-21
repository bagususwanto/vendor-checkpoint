import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReportFilterDto {
  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string;

  @IsOptional()
  @IsString()
  status?: string; // MENUNGGU, VERIFIKASI, SELESAI, DITOLAK

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  materialCategoryId?: number;
}
