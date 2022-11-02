import { NestResponse } from './../core/http/nest-response';
import { Body, Controller, HttpStatus, Get, Post, Query } from '@nestjs/common';
import { NestResponseBuilder } from 'src/core/http/nest-response-builder';
import { Driver } from './driver.entity';
import { DriverService } from './driver.service';

@Controller('drivers')
export class DriverController {
  constructor(private service: DriverService) {}

  @Get()
  public async findDrivers(@Query('page') page = 1, @Query('size') size = 10) {
    return await this.service.findDrivers(page, size);
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
}
