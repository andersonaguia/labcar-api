import { IsNotEmpty, IsString } from 'class-validator';
import { TravelStatus } from './travelSolicitations.enum';

export class Travel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  travelStatus: TravelStatus;
}
