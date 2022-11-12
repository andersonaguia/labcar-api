import { Module } from '@nestjs/common';
import { DriverDatabase } from 'src/database/drivers/drivers.database';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { TravelDatabase } from 'src/database/travels/travels.database';

@Module({
  controllers: [DriverController],
  providers: [DriverService, DriverDatabase, TravelDatabase],
})
export class DriverModule {}
