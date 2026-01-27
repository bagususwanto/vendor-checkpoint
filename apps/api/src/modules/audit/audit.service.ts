import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tx: any, createAuditDto: CreateAuditDto) {
    const prismaClient = tx || this.prisma;

    return await prismaClient.log_audit.create({
      data: {
        entry_id: createAuditDto.entry_id,
        user_id: createAuditDto.user_id,
        action_type: createAuditDto.action_type,
        action_description: createAuditDto.action_description,
        old_value: createAuditDto.old_value,
        new_value: createAuditDto.new_value,
        ip_address: createAuditDto.ip_address,
        user_agent: createAuditDto.user_agent,
      },
    });
  }

  findAll() {
    return `This action returns all audit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }
}
