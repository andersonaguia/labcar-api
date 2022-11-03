import { NestResponse } from './../core/http/nest-response';
import {
  Body,
  Controller,
  HttpStatus,
  Get,
  Post,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { NestResponseBuilder } from 'src/core/http/nest-response-builder';
import { Driver } from './driver.entity';
import { DriverService } from './driver.service';

@Controller('drivers')
export class DriverController {
  constructor(private service: DriverService) {}

  @Get()
  public async findDrivers(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('name') name,
  ) {
    return await this.service.findDrivers(page, size, name);
  }

  @Get(':cpf')
  public async getDriverByCpf(
    @Param('cpf') cpf: string,
  ): Promise<NestResponse> {
    const driver = await this.service.searchByCpf(cpf);
    return new NestResponseBuilder()
      .withStatus(HttpStatus.OK)
      .withHeaders({ Location: `drivers/${driver.cpf}` })
      .withBody(driver)
      .build();
  }

  @Post()
  public async createDriver(@Body() driver: Driver): Promise<NestResponse> {
    const driverCreated = await this.service.createDriver(driver);
    return new NestResponseBuilder()
      .withStatus(HttpStatus.CREATED)
      .withHeaders({ Location: `drivers/${driverCreated.nome}` })
      .withBody(driverCreated)
      .build();
  }

  @Put(':cpf')
  public async updateDriver(
    @Param('cpf') cpf: string,
    @Body() driver: Driver,
  ): Promise<NestResponse> {
    const driverToUpdate = await this.service.updateDriver(cpf, driver);
    return new NestResponseBuilder()
      .withStatus(HttpStatus.OK)
      .withHeaders({ Location: `drivers/${driverToUpdate.cpf}` })
      .withBody(driverToUpdate)
      .build();
  }
}
