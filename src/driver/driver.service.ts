import { Injectable } from '@nestjs/common';
import { DriverDatabase } from 'src/database/drivers/drivers.database';
import { Driver } from './driver.entity';
import { v4 as uuidv4 } from 'uuid';
import { TravelDatabase } from 'src/database/travels/travels.database';

@Injectable()
export class DriverService {
  constructor(
    private database: DriverDatabase,
    private travelDatabase: TravelDatabase,
  ) {}

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
    driverToCreate.isDeleted = false;
    driverToCreate.isBlocked = false;
    driverToCreate.id = uuidv4();
    await this.database.writeDriver(driverToCreate);
    return driverToCreate;
  }

  public async updateDriver(cpf: string, driver: Driver) {
    const allDrivers = await this.database.getDrivers();
    const driverExists = allDrivers.find(
      (drv) => drv.cpf === cpf && !drv.isDeleted,
    );
    const cpfIsEqual = driver.cpf === cpf;
    const cpfExists = allDrivers.find((drv) => drv.cpf === driver.cpf);
    if (!!driverExists && (!!cpfIsEqual || !cpfExists)) {
      const driverIndex = allDrivers.indexOf(driverExists);
      driver.id = driverExists.id;
      driver.isDeleted = driverExists.isDeleted;
      driver.isBlocked = driverExists.isBlocked;
      allDrivers[driverIndex] = driver;
      await this.database.writeDrivers(allDrivers);
      delete driver.isDeleted;
      delete driver.isBlocked;
      return driver;
    } else if (driverExists) {
      return null;
    } else {
      return null;
    }
  }

  public async blockDriver(cpf: string) {
    const drivers = await this.database.getDrivers();
    const driverToBlock = drivers.find(
      (drv) => drv.cpf === cpf && !drv.isDeleted,
    );
    if (driverToBlock) {
      const driverIndex = drivers.indexOf(driverToBlock);
      drivers[driverIndex].isBlocked = !drivers[driverIndex].isBlocked;
      await this.database.writeDrivers(drivers);
      delete driverToBlock.isDeleted;
      return driverToBlock;
    } else {
      return null;
    }
  }

  public async findByCpf(cpf: string): Promise<Driver> {
    const drivers = await this.database.getDrivers();
    const driver = drivers.find(
      (driver) => driver.cpf === cpf && !driver.isDeleted,
    );
    if (driver) {
      delete driver.isDeleted;
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
    const activeDrivers = drivers.filter(
      (driver) => driver.isDeleted === false && !driver.isDeleted,
    );
    activeDrivers.map((driver) => delete driver.isDeleted);
    if (driverName) {
      const driverSearch = activeDrivers.filter((driver) =>
        driver.name.toUpperCase().includes(driverName.toUpperCase()),
      );
      return driverSearch;
    }
    return activeDrivers.slice(
      (startPage - 1) * sizePage,
      startPage * sizePage,
    );
  }

  public async destroyDriver(driverId: string) {
    const allDrivers = await this.database.getDrivers();
    const driverToDestroy = allDrivers.find(
      (driver) => driver.id === driverId && !driver.isDeleted,
    );
    const allTravels = await this.travelDatabase.getTravels();
    const someTravel = allTravels.find(
      (travel) => travel.driverId === driverId,
    );
    if (driverToDestroy) {
      const driverIndex = allDrivers.indexOf(driverToDestroy);
      if (someTravel) {
        allDrivers[driverIndex].isDeleted = true;
      } else {
        allDrivers.splice(driverIndex, 1);
      }
      await this.database.writeDrivers(allDrivers);
      delete driverToDestroy.isDeleted;
      return driverToDestroy;
    } else {
      return null;
    }
  }
}
