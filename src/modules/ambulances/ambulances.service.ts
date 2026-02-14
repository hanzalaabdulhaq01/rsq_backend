import { Injectable, NotFoundException } from '@nestjs/common';
import { AmbulanceStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAmbulanceDto } from './dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from './dto/update-ambulance.dto';

@Injectable()
export class AmbulancesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAmbulanceDto) {
    return this.prisma.ambulance.create({
      data: dto,
      include: { organization: { select: { id: true, name: true } } },
    });
  }

  findAll(filters?: { organizationId?: string; status?: AmbulanceStatus }) {
    const where: any = {};
    if (filters?.organizationId) where.organizationId = filters.organizationId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.ambulance.findMany({
      where,
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ambulance = await this.prisma.ambulance.findUnique({
      where: { id },
      include: { organization: { select: { id: true, name: true } } },
    });
    if (!ambulance) throw new NotFoundException('Ambulance not found');
    return ambulance;
  }

  async update(id: string, dto: UpdateAmbulanceDto) {
    await this.findOne(id);
    return this.prisma.ambulance.update({
      where: { id },
      data: dto,
      include: { organization: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.ambulance.delete({ where: { id } });
    return { message: 'Ambulance deleted successfully' };
  }

  async findAvailable(type?: string) {
    return this.prisma.ambulance.findMany({
      where: {
        status: AmbulanceStatus.AVAILABLE,
        ...(type ? { type: type as any } : {}),
        currentLat: { not: null },
        currentLng: { not: null },
      },
    });
  }
}
