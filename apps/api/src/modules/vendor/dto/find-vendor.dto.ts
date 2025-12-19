import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindVendorDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit = 10;

  @IsOptional()
  @IsString()
  search = '';

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive = true;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;
}
