import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AdminActionsService } from './admin-actions.service';
import { CreateAdminActionDto } from './dto/create-admin-action.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Admin Actions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin-actions')
export class AdminActionsController {
  constructor(private readonly service: AdminActionsService) {}

  @Post()
  @ApiOperation({ summary: 'Log an admin action' })
  create(@CurrentUser() user: any, @Body() dto: CreateAdminActionDto) {
    return this.service.log(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all admin actions (audit log)' })
  @ApiQuery({ name: 'adminId', required: false })
  @ApiQuery({ name: 'action', required: false })
  findAll(
    @Query('adminId') adminId?: string,
    @Query('action') action?: string,
  ) {
    return this.service.findAll({ adminId, action });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin action by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
