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
  Options,
} from '@nestjs/common';
import { NestResponseBuilder } from 'src/core/http/nest-response-builder';
import { Driver } from './driver.entity';
import { DriverService } from './driver.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Drivers')
@Controller('drivers')
export class DriverController {
  constructor(private service: DriverService) {}

  @Get()
  @ApiOperation({summary: "Find all drivers"})
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
  public async findDrivers(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('name') name,
  ) {
    return await this.service.findDrivers(page, size, name);
  }

  @Get(':driverCpf')
  @ApiOperation({summary: "Get Driver by CPF"})
  @ApiResponse({
    status: 200,
    description: 'Busca bem sucedida.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'CPF informado não foi encontrado no banco de dados.'
  }) 
  public async getDriverByCpf(
    @Param('driverCpf') driverCpf: string,
  ): Promise<NestResponse> {
    const driver = await this.service.findDriverByCpf(driverCpf);
    if (driver) {
      return new NestResponseBuilder()
        .withStatus(HttpStatus.OK)
        .withHeaders({ Location: `drivers/${driver.cpf}` })
        .withBody(driver)
        .build();
    }
    throw new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Cpf is not found',
    });
  }

  @Post()
  @ApiOperation({summary: "Create Driver"})
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.'
  }) 
  @ApiResponse({
    status: 400,
    description: 'Dados informados no body estão incorretos para essa operação.'
  }) 
  @ApiResponse({
    status: 409,
    description: 'Já existe um motorista com o mesmo CPF.'
  }) 
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

  @Put(':driverCpf')
  @ApiOperation({summary: "Update Driver"}) 
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
  public async updateDriver(
    @Param('driverCpf') driverCpf: string,
    @Body() driver: Driver,
  ): Promise<NestResponse> {
    const driverToUpdate = await this.service.updateDriver(driverCpf, driver);
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
  @ApiOperation({summary: "Block/unlock Driver"}) 
  @ApiResponse({
    status: 200,
    description: 'Motorista bloqueado com sucesso.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'Motorista não encontrado ou com viagem em aberto.'
  })
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
      message: 'Driver is not found or travel in progress',
    });
  }

  @Delete(':driverId')
  @HttpCode(204)
  @ApiOperation({summary: "Delete Driver"}) 
  @ApiResponse({
    status: 204,
    description: 'Motorista excluído com sucesso.'
  }) 
  @ApiResponse({
    status: 404,
    description: 'Motorista não encontrado ou com viagem em aberto.'
  }) 
  public async destroyDriver(@Param('DriverId') driverId: string) {
    const driverToDestroy = await this.service.destroyDriver(driverId);
    if (!driverToDestroy) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Driver is not found or travel in progress.',
      });
    }
  }
}
