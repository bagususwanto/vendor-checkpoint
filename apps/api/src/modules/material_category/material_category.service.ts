import { Injectable } from '@nestjs/common';
import { CreateMaterialCategoryDto } from './dto/create-material_category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material_category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class MaterialCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMaterialCategoryDto: CreateMaterialCategoryDto) {
    return 'This action adds a new materialCategory';
  }

  findAll() {
    return `This action returns all materialCategory`;
  }

  findOne(id: number) {
    return this.prisma.mst_material_category.findUnique({
      where: {
        material_category_id: id,
      },
    });
  }

  update(id: number, updateMaterialCategoryDto: UpdateMaterialCategoryDto) {
    return `This action updates a #${id} materialCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialCategory`;
  }
}
