import { Module } from '@nestjs/common';
import { Database } from 'src/database/passengers/passengers.database';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';

@Module({
  controllers: [PassengerController],
  providers: [PassengerService, Database],
})
export class PassengerModule {}
