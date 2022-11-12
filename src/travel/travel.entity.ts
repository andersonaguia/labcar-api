import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TravelStatus } from './travelSolicitations.enum';

export class Travel {
  travelId: string;

  driverId: string;

  @ApiProperty({
    example: "a810f9ef-34d3-4a2a-b9bb-219bdf34f5f8"    
  })
  @IsNotEmpty()
  @IsString()
  passengerId: string;

  @ApiProperty({
    example: "Rua NestJS"    
  })
  @IsNotEmpty()
  @IsString()
  origin: string;

  @ApiProperty({
    example: "Rua JavaScript"    
  })
  @IsNotEmpty()
  @IsString()
  destination: string;

  distance: number;

  travelStatus: TravelStatus;
}
