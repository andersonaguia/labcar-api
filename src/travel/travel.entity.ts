import { IsNotEmpty, IsString } from 'class-validator';
import { TravelStatus } from './travelSolicitations.enum';

export class Travel {
  @IsNotEmpty()
  @IsString()
  passengerId: string;

  travelId: string;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  travelStatus: TravelStatus;
}
