import { Module } from '@nestjs/common';
import { Database } from 'src/database/travels/travels.database';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';

@Module({
  controllers: [TravelController],
  providers: [TravelService, Database],
})
export class TravelModule {}
