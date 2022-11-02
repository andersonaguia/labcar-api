import { Injectable } from '@nestjs/common';
import { writeFile, readFile } from 'fs/promises';
import { Driver } from 'src/driver/driver.entity';

@Injectable()
export class Database {
  private FILENAME = 'drivers.json';

  public async getDrivers(): Promise<Driver[]> {
    const driversInFile = await readFile(this.FILENAME, 'utf-8');
    const drivers = JSON.parse(driversInFile);
    return drivers;
  }

  public async writeDriver(driver: Driver) {
    let drivers: Driver[] = await this.getDrivers();
    if (!drivers) {
      drivers = [];
    }
    await writeFile(this.FILENAME, JSON.stringify([...drivers, driver]));
  }

  public async writeDrivers(drivers: Driver[]) {
    await writeFile(this.FILENAME, JSON.stringify(drivers));
  }
}
