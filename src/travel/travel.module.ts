import { Module } from '@nestjs/common';
import { TravelDatabase } from 'src/database/travels/travels.database';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { Database } from 'src/database/passengers/passengers.database';

@Module({
  controllers: [TravelController],
  providers: [TravelService, TravelDatabase, Database],
})
export class TravelModule {}
