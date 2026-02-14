import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role, RegistrationStatus } from '@prisma/client';
import { ParamedicProfilesService } from './paramedic-profiles.service';
import { CreateParamedicProfileDto } from './dto/create-paramedic-profile.dto';
import { UpdateParamedicProfileDto } from './dto/update-paramedic-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Paramedic Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('paramedic-profiles')
export class ParamedicProfilesController {
  constructor(private readonly service: ParamedicProfilesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create paramedic profile (Admin)' })
  create(@Body() dto: CreateParamedicProfileDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List paramedic profiles (Admin)' })
  @ApiQuery({ name: 'status', enum: RegistrationStatus, required: false })
  findAll(@Query('status') status?: RegistrationStatus) {
    return this.service.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get paramedic profile by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get paramedic profile by user ID' })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findByUserId(userId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update paramedic profile (Admin — verify/reject)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateParamedicProfileDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete paramedic profile (Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
