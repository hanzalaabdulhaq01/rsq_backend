import { Module } from '@nestjs/common';
import { AmbulancesService } from './ambulances.service';
import { AmbulancesController } from './ambulances.controller';

@Module({
  controllers: [AmbulancesController],
  providers: [AmbulancesService],
  exports: [AmbulancesService],
})
export class AmbulancesModule {}
