import { NestResponse } from '../core/http/nest-response';
import {
  Body,
  Controller,
  HttpStatus,
  Get,
  Post,
  Query,
  Param,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { NestResponseBuilder } from 'src/core/http/nest-response-builder';
import { Travel } from './travel.entity';
import { TravelService } from './travel.service';

@Controller('travels')
export class TravelController {
  constructor(private service: TravelService) {}

  @Get()
  public async findTravels(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('travelStatus') travelStatus,
  ) {
    return await this.service.findTravels(page, size, travelStatus);
  }

  @Get(':id')
  public async getTravelById(@Param('id') id: string): Promise<NestResponse> {
    const travel = await this.service.findTravelById(id);
    if (travel) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `travels/${travel.travelId}` })
        .withBody(travel)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Id is not found',
    });
  }

  @Post()
  public async createTravel(@Body() travel: Travel): Promise<NestResponse> {
    const travelCreated = await this.service.createTravel(travel);
    if (travelCreated) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.CREATED)
        .withHeaders({ Location: `travels/${travelCreated.travelId}` })
        .withBody(travelCreated)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Operation not allowed.',
    });
  }

  @Patch(':travelId/:travelStatus/update')
  public async updateTravelStatus(
    @Param('travelId') travelId: string,
    @Param('travelStatus') travelStatus: number,
  ): Promise<NestResponse> {
    const travelUpdated = await this.service.updateStatusTravel(
      travelId,
      travelStatus,
    );
    if (travelUpdated) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `drivers/${travelUpdated.travelId}` })
        .withBody(travelUpdated)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Travel ID not found or invalid status',
    });
  }
}
