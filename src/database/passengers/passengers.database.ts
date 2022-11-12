import { Injectable } from '@nestjs/common';
import { writeFile, readFile } from 'fs/promises';
import { Passenger } from 'src/passenger/passenger.entity';

@Injectable()
export class Database {
  private FILENAME = 'passengers.json';

  public async getPassengers(): Promise<Passenger[]> {
    const passengersInFile = await readFile(this.FILENAME, 'utf-8');
    const passengers = JSON.parse(passengersInFile);
    return passengers;
  }

  public async writePassenger(passenger: Passenger) {
    let passengers: Passenger[] = await this.getPassengers();
    if (!passengers) {
      passengers = [];
    }
    await writeFile(this.FILENAME, JSON.stringify([...passengers, passenger]));
  }

  public async writePassengers(passengers: Passenger[]) {
    await writeFile(this.FILENAME, JSON.stringify(passengers));
  }
}
