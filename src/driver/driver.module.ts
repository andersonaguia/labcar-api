import { Module } from '@nestjs/common';
import { DriverDatabase } from 'src/database/drivers/drivers.database';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  controllers: [DriverController],
  providers: [DriverService, DriverDatabase],
})
export class DriverModule {}
