import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role, AmbulanceStatus } from '@prisma/client';
import { AmbulancesService } from './ambulances.service';
import { CreateAmbulanceDto } from './dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from './dto/update-ambulance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Ambulances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ambulances')
export class AmbulancesController {
  constructor(private readonly service: AmbulancesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Register new ambulance (Admin)' })
  create(@Body() dto: CreateAmbulanceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List ambulances' })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'status', enum: AmbulanceStatus, required: false })
  findAll(
    @Query('organizationId') organizationId?: string,
    @Query('status') status?: AmbulanceStatus,
  ) {
    return this.service.findAll({ organizationId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ambulance by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DRIVER)
  @ApiOperation({ summary: 'Update ambulance (Admin/Driver)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAmbulanceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete ambulance (Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
