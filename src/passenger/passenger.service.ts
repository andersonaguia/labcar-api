import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/passengers/passengers.database';
import { Passenger } from './passenger.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PassengerService {
  constructor(private database: Database) {}

  public async createPassenger(passenger: Passenger): Promise<Passenger> {
    const passengerToCreate = passenger;
    passengerToCreate.cpf = passengerToCreate.cpf.replace(/\D/g, '');
    const allpassengers = await this.database.getPassengers();
    const passengerExist = allpassengers.find(
      (drv) => drv.cpf === passengerToCreate.cpf,
    );
    if (passengerExist) {
      return null;
    }
    passengerToCreate.id = uuidv4();
    await this.database.writePassenger(passengerToCreate);
    return passengerToCreate;
  }

  public async updatePassenger(cpf: string, passenger: Passenger) {
    const allPassengers = await this.database.getPassengers();
    const passengerExists = allPassengers.find((pass) => pass.cpf === cpf);
    const cpfIsEqual = passenger.cpf === cpf;
    const cpfExists = allPassengers.find((pass) => pass.cpf === passenger.cpf);
    if (!!passengerExists && (!!cpfIsEqual || !cpfExists)) {
      const passengerIndex = allPassengers.indexOf(passengerExists);
      allPassengers[passengerIndex] = passenger;
      await this.database.writePassengers(allPassengers);
      return passenger;
    } else if (passengerExists) {
      return null;
    } else {
      return null;
    }
  }

  public async searchByCpf(cpf: string): Promise<Passenger> {
    const passengers = await this.database.getPassengers();
    const passenger = passengers.find((passenger) => passenger.cpf === cpf);
    if (passenger) {
      return passenger;
    } else {
      return null;
    }
  }

  public async findPassengers(page: number, size: number, name: string) {
    const startPage = page < 1 ? 1 : page;
    const sizePage = size < 0 ? 1 : size;
    const passengerName = name || '';
    const passengers = await this.database.getPassengers();

    if (passengerName) {
      const passengerSearch = passengers.filter((passenger) =>
        passenger.nome.toUpperCase().includes(passengerName.toUpperCase()),
      );
      return passengerSearch;
    }

    return passengers.slice((startPage - 1) * sizePage, startPage * sizePage);
  }

  public async destroyPassenger(cpf: string) {
    const passengers = await this.database.getPassengers();
    const passengerToDestroy = passengers.find((drv) => drv.cpf === cpf);
    if (passengerToDestroy) {
      const passengerIndex = passengers.indexOf(passengerToDestroy);
      passengers.splice(passengerIndex, 1);
      await this.database.writePassengers(passengers);
      return passengerToDestroy;
    } else {
      return null;
    }
  }
}
