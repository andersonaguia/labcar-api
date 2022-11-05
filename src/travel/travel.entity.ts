import { IsNotEmpty, IsString } from 'class-validator';
import { TravelStatus } from './travelSolicitations.enum';

export class Travel {
  travelId: string;
  driverId: string;

  @IsNotEmpty()
  @IsString()
  passengerId: string;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  travelStatus: TravelStatus;
}
