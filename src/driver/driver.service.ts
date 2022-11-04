import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/drivers/drivers.database';
import { Driver } from './driver.entity';

@Injectable()
export class DriverService {
  constructor(private database: Database) {}

  public async createDriver(driver: Driver): Promise<Driver> {
    const driverToCreate = driver;
    driverToCreate.cpf = driverToCreate.cpf.replace(/\D/g, '');
    const allDrivers = await this.database.getDrivers();
    const driverExist = allDrivers.find(
      (drv) => drv.cpf === driverToCreate.cpf,
    );
    if (driverExist) {
      return null;
    }
    driverToCreate.isBlocked = false;
    await this.database.writeDriver(driverToCreate);
    return driverToCreate;
  }

  public async updateDriver(cpf: string, driver: Driver) {
    const allDrivers = await this.database.getDrivers();
    const driverExists = allDrivers.find((drv) => drv.cpf === cpf);
    const cpfIsEqual = driver.cpf === cpf;
    const cpfExists = allDrivers.find((drv) => drv.cpf === driver.cpf);
    if (!!driverExists && (!!cpfIsEqual || !cpfExists)) {
      const driverIndex = allDrivers.indexOf(driverExists);
      driver.isBlocked = driverExists.isBlocked;
      allDrivers[driverIndex] = driver;
      await this.database.writeDrivers(allDrivers);
      return driver;
    } else if (driverExists) {
      return null;
    } else {
      return null;
    }
  }

  public async blockDriver(cpf: string) {
    const drivers = await this.database.getDrivers();
    const driverToBlock = drivers.find((drv) => drv.cpf === cpf);
    if (driverToBlock) {
      const driverIndex = drivers.indexOf(driverToBlock);
      drivers[driverIndex].isBlocked = !drivers[driverIndex].isBlocked;
      await this.database.writeDrivers(drivers);
      return driverToBlock;
    } else {
      return null;
    }
  }

  public async searchByCpf(cpf: string): Promise<Driver> {
    const drivers = await this.database.getDrivers();
    const driver = drivers.find((driver) => driver.cpf === cpf);
    if (driver) {
      return driver;
    } else {
      return null;
    }
  }

  public async findDrivers(page: number, size: number, name: string) {
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

  public async destroyDriver(cpf: string) {
    const drivers = await this.database.getDrivers();
    const driverToDestroy = drivers.find((drv) => drv.cpf === cpf);
    if (driverToDestroy) {
      const driverIndex = drivers.indexOf(driverToDestroy);
      drivers.splice(driverIndex, 1);
      await this.database.writeDrivers(drivers);
      return driverToDestroy;
    } else {
      return null;
    }
  }
}
