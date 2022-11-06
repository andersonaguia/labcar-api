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
  Patch,
  Delete,
  HttpCode,
  ConflictException,
  NotFoundException,
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

  @Get(':driverId')
  public async getDriverByCpf(
    @Param('driverId') driverId: string,
  ): Promise<NestResponse> {
    const driver = await this.service.findDriverById(driverId);
    if (driver) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `drivers/${driver.id}` })
        .withBody(driver)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Id is not found',
    });
  }

  @Post()
  public async createDriver(@Body() driver: Driver): Promise<NestResponse> {
    const driverCreated = await this.service.createDriver(driver);
    if (driverCreated) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.CREATED)
        .withHeaders({ Location: `drivers/${driverCreated.cpf}` })
        .withBody(driverCreated)
        .build();
    }
    throw new ConflictException({
      statusCode: 409,
      message: 'There is already a driver with the same cpf.',
    });
  }

  @Put(':cpf')
  public async updateDriver(
    @Param('cpf') cpf: string,
    @Body() driver: Driver,
  ): Promise<NestResponse> {
    const driverToUpdate = await this.service.updateDriver(cpf, driver);
    if (driverToUpdate) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `drivers/${driverToUpdate.cpf}` })
        .withBody(driverToUpdate)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Cpf is not found',
    });
  }

  @Patch(':driverId/block')
  public async blockDriver(
    @Param('driverId') driverId: string,
  ): Promise<NestResponse> {
    const driverBlocked = await this.service.blockDriver(driverId);
    if (driverBlocked) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `drivers/${driverBlocked.id}` })
        .withBody(driverBlocked)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Driver is not found',
    });
  }

  @Delete(':cpf')
  @HttpCode(204)
  public async destroyDriver(@Param('cpf') cpf: string) {
    const driverToDestroy = await this.service.destroyDriver(cpf);
    if (!driverToDestroy) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Driver is not found',
      });
    }
  }
}
