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
    const allDrivers = await this.database.getDrivers();
    const driverExist = allDrivers.find((drv) => drv.cpf === driver.cpf);
    if (driverExist) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Já existe outro motorista com o mesmo cpf',
      });
    }
    await this.database.writeDriver(driver);
    return driver;
  }

  public async searchByCpf(cpf: string): Promise<Driver> {
    const drivers = await this.database.getDrivers();
    const driver = drivers.find((driver) => driver.cpf === cpf);
    if (driver) {
      return driver;
    } else {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Driver is not found',
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
