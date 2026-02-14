import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { TrackingService } from './tracking.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly service: TrackingService) {}

  @Post('update')
  @Roles(Role.DRIVER)
  @ApiOperation({ summary: 'Update ambulance location (Driver) — REST fallback' })
  updateLocation(@Body() dto: UpdateLocationDto) {
    return this.service.updateLocation(dto);
  }

  @Get('live')
  @ApiOperation({ summary: 'Get all ambulances with known locations' })
  getLiveLocations() {
    return this.service.getLiveLocations();
  }

  @Get(':ambulanceId')
  @ApiOperation({ summary: 'Get latest location of an ambulance' })
  getLatest(@Param('ambulanceId', ParseUUIDPipe) ambulanceId: string) {
    return this.service.getLatestLocation(ambulanceId);
  }

  @Get(':ambulanceId/history')
  @ApiOperation({ summary: 'Get tracking history for an ambulance' })
  @ApiQuery({ name: 'rideRequestId', required: false })
  getHistory(
    @Param('ambulanceId', ParseUUIDPipe) ambulanceId: string,
    @Query('rideRequestId') rideRequestId?: string,
  ) {
    return this.service.getTrackingHistory(ambulanceId, rideRequestId);
  }
}
