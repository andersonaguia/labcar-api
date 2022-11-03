import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Database } from 'src/database/drivers/drivers.database';
import { Driver } from './driver.entity';

@Injectable()
export class DriverService {
  constructor(private database: Database) {}

  public async createDriver(driver: Driver): Promise<Driver> {
    const driverToCreate = driver;
    const allDrivers = await this.database.getDrivers();
    const driverExist = allDrivers.find(
      (drv) => drv.cpf === driverToCreate.cpf,
    );
    if (driverExist) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Já existe outro motorista com o mesmo cpf',
      });
    }
    driverToCreate.isBlocked = false; //Devemos retornar na criação?
    await this.database.writeDriver(driverToCreate);
    return driverToCreate;
  }

  public async updateDriver(cpf: string, driver: Driver) {
    const driverToUpdate = driver;
    const driverExists = await this.searchByCpf(cpf);

    if (driverExists) {
      const allDrivers = await this.database.getDrivers();
      const driverIndex = allDrivers.indexOf(driverExists);
      const updatedDriver = allDrivers.map((drv) => {
        if (drv.cpf === cpf) {
          drv.nome = driverToUpdate.nome || drv.nome;
          drv.dataNascimento =
            driverToUpdate.dataNascimento || drv.dataNascimento;
          drv.cpf = driverToUpdate.cpf || drv.cpf;
          drv.placa = driverToUpdate.placa || drv.placa;
          drv.modelo = driverToUpdate.modelo || drv.modelo;
          drv.isBlocked = driverToUpdate.isBlocked || drv.isBlocked;
        }
        return drv;
      });
      allDrivers[driverIndex] = updatedDriver[0];
      await this.database.writeDrivers(allDrivers);
      return updatedDriver[0];
    }
  }

  public async searchByCpf(cpf: string): Promise<Driver> {
    const drivers = await this.database.getDrivers();
    const driver = drivers.find((driver) => driver.cpf === cpf);
    if (driver) {
      return driver;
    } else {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Cpf is not found',
      });
    }
  }

  public async findDrivers(page, size, name) {
    const startPage = page < 1 ? 1 : page;
    const sizePage = size < 0 ? 1 : size;
    const driverName = name || '';
    const drivers = await this.database.getDrivers();

    if (driverName) {
      const driverSearch = drivers.filter((driver) =>
        driver.nome.toUpperCase().includes(driverName.toUpperCase()),
      );
      return driverSearch;
    }

    return drivers.slice((startPage - 1) * sizePage, startPage * sizePage);
  }
}
