import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateDriverPerformanceDto } from './dto/update-driver-performance.dto';

@Injectable()
export class DriverPerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    driver: { select: { id: true, name: true, email: true, phone: true, role: true } },
  };

  async getOrCreate(driverId: string) {
    let record = await this.prisma.driverPerformance.findUnique({
      where: { driverId },
      include: this.include,
    });

    if (!record) {
      record = await this.prisma.driverPerformance.create({
        data: { driverId },
        include: this.include,
      });
    }

    return record;
  }

  findAll(orderBy?: 'rating' | 'totalRides' | 'averageResponseTime') {
    const sort = orderBy ?? 'rating';
    return this.prisma.driverPerformance.findMany({
      include: this.include,
      orderBy: { [sort]: 'desc' },
    });
  }

  async findByDriverId(driverId: string) {
    return this.getOrCreate(driverId);
  }

  async update(driverId: string, dto: UpdateDriverPerformanceDto) {
    await this.getOrCreate(driverId);

    return this.prisma.driverPerformance.update({
      where: { driverId },
      data: {
        ...dto,
        lastActive: new Date(),
      },
      include: this.include,
    });
  }

  async incrementRides(driverId: string) {
    const record = await this.getOrCreate(driverId);

    return this.prisma.driverPerformance.update({
      where: { driverId },
      data: {
        totalRides: record.totalRides + 1,
        lastActive: new Date(),
      },
      include: this.include,
    });
  }

  async addRating(driverId: string, newRating: number) {
    const record = await this.getOrCreate(driverId);

    // Running average formula
    const currentRating = record.rating ?? 0;
    const totalRides = record.totalRides || 1;
    const updatedRating =
      (currentRating * (totalRides - 1) + newRating) / totalRides;

    return this.prisma.driverPerformance.update({
      where: { driverId },
      data: {
        rating: Math.round(updatedRating * 100) / 100,
        lastActive: new Date(),
      },
      include: this.include,
    });
  }
}
