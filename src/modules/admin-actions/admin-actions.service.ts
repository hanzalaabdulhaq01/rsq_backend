import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAdminActionDto } from './dto/create-admin-action.dto';

@Injectable()
export class AdminActionsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    admin: { select: { id: true, name: true, email: true, role: true } },
  };

  async log(adminId: string, dto: CreateAdminActionDto) {
    return this.prisma.adminAction.create({
      data: {
        adminId,
        action: dto.action,
        targetId: dto.targetId,
        metadata: dto.metadata,
      },
      include: this.include,
    });
  }

  findAll(filters?: { adminId?: string; action?: string }) {
    const where: any = {};
    if (filters?.adminId) where.adminId = filters.adminId;
    if (filters?.action) where.action = { contains: filters.action, mode: 'insensitive' };

    return this.prisma.adminAction.findMany({
      where,
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.adminAction.findUnique({
      where: { id },
      include: this.include,
    });
  }
}
