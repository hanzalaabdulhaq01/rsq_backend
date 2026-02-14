import { Module } from '@nestjs/common';
import { DriverPerformanceService } from './driver-performance.service';
import { DriverPerformanceController } from './driver-performance.controller';

@Module({
  controllers: [DriverPerformanceController],
  providers: [DriverPerformanceService],
  exports: [DriverPerformanceService],
})
export class DriverPerformanceModule {}
