import { Module } from '@nestjs/common';
import { Database } from 'src/database/passengers/passengers.database';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { TravelDatabase } from 'src/database/travels/travels.database';
@Module({
  controllers: [PassengerController],
  providers: [PassengerService, Database, TravelDatabase],
})
export class PassengerModule {}
