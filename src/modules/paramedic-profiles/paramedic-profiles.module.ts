import { Module } from '@nestjs/common';
import { ParamedicProfilesService } from './paramedic-profiles.service';
import { ParamedicProfilesController } from './paramedic-profiles.controller';

@Module({
  controllers: [ParamedicProfilesController],
  providers: [ParamedicProfilesService],
  exports: [ParamedicProfilesService],
})
export class ParamedicProfilesModule {}
