import { Injectable } from '@nestjs/common';
import { CreateSystemConfigDto } from './dto/create-system-config.dto';
import { UpdateSystemConfigDto } from './dto/update-system-config.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SystemConfigService {
  constructor(private prisma: PrismaService) {}

  create(createSystemConfigDto: CreateSystemConfigDto) {
    return 'This action adds a new systemConfig';
  }

  findAll() {
    return `This action returns all systemConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemConfig`;
  }

  findByConfigKey(config_key: string) {
    return this.prisma.cfg_system.findUnique({
      where: {
        config_key: config_key,
      },
    });
  }

  update(id: number, updateSystemConfigDto: UpdateSystemConfigDto) {
    return `This action updates a #${id} systemConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemConfig`;
  }
}
