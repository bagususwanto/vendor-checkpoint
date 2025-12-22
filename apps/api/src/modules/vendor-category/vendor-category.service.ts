import { Injectable } from '@nestjs/common';
import { CreateVendorCategoryDto } from './dto/create-vendor-category.dto';
import { UpdateVendorCategoryDto } from './dto/update-vendor-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class VendorCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createVendorCategoryDto: CreateVendorCategoryDto) {
    return 'This action adds a new vendorCategory';
  }

  findAll() {
    return `This action returns all vendorCategory`;
  }

  findOne(id: number) {
    return this.prisma.mst_vendor_category.findUnique({
      where: {
        vendor_category_id: id,
      },
    });
  }

  update(id: number, updateVendorCategoryDto: UpdateVendorCategoryDto) {
    return `This action updates a #${id} vendorCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendorCategory`;
  }
}
