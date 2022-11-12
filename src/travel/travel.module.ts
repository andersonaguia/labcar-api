import { Module } from '@nestjs/common';
import { TravelDatabase } from 'src/database/travels/travels.database';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { Database } from 'src/database/passengers/passengers.database';
import { DriverDatabase } from 'src/database/drivers/drivers.database';

@Module({
  controllers: [TravelController],
  providers: [TravelService, TravelDatabase, Database, DriverDatabase],
})
export class TravelModule {}
