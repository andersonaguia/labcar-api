import { Module } from '@nestjs/common';
import { Database } from 'src/database/drivers/drivers.database';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  controllers: [DriverController],
  providers: [DriverService, Database],
})
export class DriverModule {}
