import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateHospitalDto) {
    return this.prisma.hospital.create({
      data: dto,
      include: { organization: { select: { id: true, name: true } } },
    });
  }

  findAll(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};
    return this.prisma.hospital.findMany({
      where,
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id },
      include: { organization: { select: { id: true, name: true } } },
    });
    if (!hospital) throw new NotFoundException('Hospital not found');
    return hospital;
  }

  async update(id: string, dto: UpdateHospitalDto) {
    await this.findOne(id);
    return this.prisma.hospital.update({
      where: { id },
      data: dto,
      include: { organization: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.hospital.delete({ where: { id } });
    return { message: 'Hospital deleted successfully' };
  }
}
