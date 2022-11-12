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
import { ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Travels')
@Controller('travels')
export class TravelController {
  constructor(private service: TravelService) {}

  @Get()
  @ApiOperation({summary: "Get All Travels"}) 
  @ApiQuery({
    description: "Valores possíveis para travelStatus: 0 (CREATED), 1 (ACCEPTED), 2 (REFUSED), 3 (DONE)",
    name: 'travelStatus',
    required: false,
    type: Number,
  })  
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })  
  @ApiResponse({
    status: 200,
    description: 'Busca bem sucedida.'
  })
  public async findAllTravels(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('travelStatus') travelStatus,
  ) {
    return await this.service.findAllTravels(page, size, travelStatus);
  }

  @Get(':travelId')
  @ApiOperation({summary: "Get Travel by ID"}) 
  @ApiResponse({
    status: 200,
    description: 'Busca bem sucedida.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'ID não encontrado.'
  })
  public async getTravelById(@Param('travelId') travelId: string): Promise<NestResponse> {
    const travel = await this.service.findTravelById(travelId);
    if (travel) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `travels/${travel.travelId}` })
        .withBody(travel)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Travel id is not found',
    });
  }

  @Get(':driverId/:distance/travelNearby')
  @ApiOperation({summary: "Find nearby travels"}) 
  @ApiResponse({
    status: 200,
    description: 'Busca bem sucedida.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'ID não encontrado ou motorista bloqueado.'
  })
  public async getNearbyTravels(
    @Param('driverId') driverId: string,
    @Param('distance') distance: number,
  ): Promise<NestResponse> {
    const nearbyTravels = await this.service.findNearbyTravels(
      driverId,
      distance,
    );
    if (nearbyTravels) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withBody(nearbyTravels)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Driver does not exist or is blocked',
    });
  }

  @Post()
  @ApiOperation({summary: "Create Travel"})
  @ApiResponse({
    status: 201,
    description: 'Viagem criado com sucesso.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'Passageiro não encontrado ou com viagem em aberto.'
  })
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
      message: 'Operation not allowed or travel in progress.',
    });
  }

  @Patch()
  @ApiOperation({summary: "Update travel status"}) 
  @ApiQuery({
    description: "Valores possíveis para travelStatus: 1 (ACCEPTED), 2 (REFUSED), 3 (DONE)",
    name: 'travelStatus',
    required: true,
    type: Number,
  })  
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'ID do motorista ou da viagem não encontrado ou status inválido.'
  })
  public async updateTravelStatus(
    @Query('travelId') travelId: string,
    @Query('driverId') driverId: string,
    @Query('travelStatus') travelStatus: number,
  ): Promise<NestResponse> {
    const travelUpdated = await this.service.updateStatusTravel(
      travelId,
      driverId,
      travelStatus,
    );
    if (travelUpdated) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `travels/${travelUpdated.travelId}` })
        .withBody(travelUpdated)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Invalid status, travel ID or driver ID not found',
    });
  }
}
