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

@Controller('passengers')
export class PassengerController {
  constructor(private service: PassengerService) {}

  @Get()
  public async findPassengers(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('name') name,
  ) {
    return await this.service.findPassengers(page, size, name);
  }

  @Get(':cpf')
  public async getPassengerByCpf(
    @Param('cpf') cpf: string,
  ): Promise<NestResponse> {
    const passenger = await this.service.findPassengerByCpf(cpf);
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

  @Put(':cpf')
  public async updatePassenger(
    @Param('cpf') cpf: string,
    @Body() passenger: Passenger,
  ): Promise<NestResponse> {
    const passengerToUpdate = await this.service.updatePassenger(
      cpf,
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

  @Delete(':cpf')
  @HttpCode(204)
  public async destroyPassenger(@Param('cpf') cpf: string) {
    const passengerToDestroy = await this.service.destroyPassenger(cpf);
    if (!passengerToDestroy) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Passenger is not found',
      });
    }
  }
}
