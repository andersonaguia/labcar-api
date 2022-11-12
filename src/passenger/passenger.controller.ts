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
import { Passenger } from './passenger.entity';
import { PassengerService } from './passenger.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Passengers')
@Controller('passengers')
export class PassengerController {
  constructor(private service: PassengerService) {}

  @Get()
  @ApiOperation({summary: "Find all passengers"})
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
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
    description: 'Operação realizada com sucesso.'
  })
  public async findPassengers(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('name') name,
  ) {
    return await this.service.findPassengers(page, size, name);
  }

  @Get(':passengerCpf')
  @ApiOperation({summary: "Get Passenger by CPF"})
  @ApiResponse({
    status: 200,
    description: 'Busca bem sucedida.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'CPF informado não foi encontrado no banco de dados.'
  }) 
  public async getPassengerByCpf(
    @Param('passengerCpf') passengerCpf: string,
  ): Promise<NestResponse> {
    const passenger = await this.service.findPassengerByCpf(passengerCpf);
    if (passenger) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `passengers/${passenger.cpf}` })
        .withBody(passenger)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Cpf is not found',
    });
  }

  @Post()
  @ApiOperation({summary: "Create Passenger"})
  @ApiResponse({
    status: 201,
    description: 'Passageiro criado com sucesso.'
  }) 
  @ApiResponse({
    status: 400,
    description: 'Dados informados no body estão incorretos para essa operação.'
  }) 
  @ApiResponse({
    status: 409,
    description: 'Já existe um passageiro com o mesmo CPF.'
  }) 
  public async createPassenger(
    @Body() passenger: Passenger,
  ): Promise<NestResponse> {
    const passengerCreated = await this.service.createPassenger(passenger);
    if (passengerCreated) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.CREATED)
        .withHeaders({ Location: `passengers/${passengerCreated.nome}` })
        .withBody(passengerCreated)
        .build();
    }
    throw new ConflictException({
      statusCode: 409,
      message: 'There is already a passenger with the same cpf.',
    });
  }

  @Put(':passengerCpf')
  @ApiOperation({summary: "Update Passenger"}) 
  @ApiResponse({
    status: 400,
    description: 'Dados informados no body estão incorretos.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'CPF não foi encontrado no banco de dados.'
  }) 
  @ApiResponse({
    status: 200,
    description: 'Operação bem sucedida.'
  }) 
  public async updatePassenger(
    @Param('passengerCpf') passengerCpf: string,
    @Body() passenger: Passenger,
  ): Promise<NestResponse> {
    const passengerToUpdate = await this.service.updatePassenger(
      passengerCpf,
      passenger,
    );
    if (passengerToUpdate) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `passengers/${passengerToUpdate.cpf}` })
        .withBody(passengerToUpdate)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Cpf is not found',
    });
  }

  @Delete(':passengerId')
  @HttpCode(204)
  @ApiOperation({summary: "Delete Passenger"}) 
  @ApiResponse({
    status: 204,
    description: 'Passageiro excluído com sucesso.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'Passageiro não encontrado ou com viagem em aberto.'
  })
  public async destroyPassenger(@Param('passengerId') passengerId: string) {
    const passengerToDestroy = await this.service.destroyPassenger(passengerId);
    if (!passengerToDestroy) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Passenger is not found or travel in progress.',
      });
    }
  }
}
