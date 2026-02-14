import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async updateLocation(dto: UpdateLocationDto) {
    // Update ambulance's current location
    await this.prisma.ambulance.update({
      where: { id: dto.ambulanceId },
      data: { currentLat: dto.lat, currentLng: dto.lng },
    });

    // Create tracking log entry
    const log = await this.prisma.ambulanceTracking.create({
      data: {
        ambulanceId: dto.ambulanceId,
        rideRequestId: dto.rideRequestId,
        lat: dto.lat,
        lng: dto.lng,
      },
    });

    return log;
  }

  async getTrackingHistory(ambulanceId: string, rideRequestId?: string) {
    const where: any = { ambulanceId };
    if (rideRequestId) where.rideRequestId = rideRequestId;

    return this.prisma.ambulanceTracking.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });
  }

  async getLatestLocation(ambulanceId: string) {
    const ambulance = await this.prisma.ambulance.findUnique({
      where: { id: ambulanceId },
      select: { id: true, registrationNumber: true, currentLat: true, currentLng: true, status: true },
    });
    if (!ambulance) throw new NotFoundException('Ambulance not found');
    return ambulance;
  }

  async getLiveLocations() {
    return this.prisma.ambulance.findMany({
      where: {
        currentLat: { not: null },
        currentLng: { not: null },
      },
      select: {
        id: true,
        registrationNumber: true,
        type: true,
        status: true,
        currentLat: true,
        currentLng: true,
      },
    });
  }
}
