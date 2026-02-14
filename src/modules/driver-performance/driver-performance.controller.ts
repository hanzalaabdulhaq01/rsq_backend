import { Controller, Get, Patch, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { DriverPerformanceService } from './driver-performance.service';
import { UpdateDriverPerformanceDto } from './dto/update-driver-performance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Driver Performance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('driver-performance')
export class DriverPerformanceController {
  constructor(private readonly service: DriverPerformanceService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all driver performance records (Admin)' })
  @ApiQuery({ name: 'orderBy', required: false, enum: ['rating', 'totalRides', 'averageResponseTime'] })
  findAll(@Query('orderBy') orderBy?: 'rating' | 'totalRides' | 'averageResponseTime') {
    return this.service.findAll(orderBy);
  }

  @Get('me')
  @Roles(Role.DRIVER)
  @ApiOperation({ summary: 'Get my performance stats (Driver)' })
  getMyPerformance(@CurrentUser() user: any) {
    return this.service.findByDriverId(user.id);
  }

  @Get(':driverId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get driver performance by driver ID (Admin)' })
  findByDriver(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.service.findByDriverId(driverId);
  }

  @Patch(':driverId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update driver performance (Admin)' })
  update(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() dto: UpdateDriverPerformanceDto,
  ) {
    return this.service.update(driverId, dto);
  }
}
