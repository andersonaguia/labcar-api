import { NestResponse } from '../core/http/nest-response';
import {
  Body,
  Controller,
  HttpStatus,
  Get,
  Post,
  Query,
  Param,
  Put,
  Delete,
  HttpCode,
  ConflictException,
  NotFoundException,
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
    @Query('name') name,
  ) {
    return await this.service.findTravels(page, size, name);
  }

  @Get(':id')
  public async getTravelById(@Param('id') id: string): Promise<NestResponse> {
    const travel = await this.service.searchById(id);
    if (travel) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `travels/${travel.id}` })
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
        .withHeaders({ Location: `travels/${travelCreated.id}` })
        .withBody(travelCreated)
        .build();
    }
    throw new ConflictException({
      statusCode: 409,
      message: 'There is already a travel with the same id.',
    });
  }

  @Put(':id')
  public async updateTravel(
    @Param('id') id: string,
    @Body() travel: Travel,
  ): Promise<NestResponse> {
    const travelToUpdate = await this.service.updateTravel(id, travel);
    if (travelToUpdate) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `travels/${travelToUpdate.id}` })
        .withBody(travelToUpdate)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Id is not found',
    });
  }

  @Delete(':id')
  @HttpCode(204)
  public async destroyTravel(@Param('id') id: string) {
    const travelToDestroy = await this.service.destroyTravel(id);
    if (!travelToDestroy) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Travel is not found',
      });
    }
  }
}
