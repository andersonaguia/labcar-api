import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/passengers/passengers.database';
import { Passenger } from './passenger.entity';
import { v4 as uuidv4 } from 'uuid';
import { TravelDatabase } from 'src/database/travels/travels.database';
import { TravelStatus } from 'src/travel/travelSolicitations.enum';

@Injectable()
export class PassengerService {
  constructor(
    private database: Database,
    private travelDatabase: TravelDatabase,
  ) {}

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
    passengerToCreate.isDeleted = false;
    await this.database.writePassenger(passengerToCreate);
    return passengerToCreate;
  }

  public async updatePassenger(cpf: string, passenger: Passenger) {
    const allPassengers = await this.database.getPassengers();
    const passengerExists = allPassengers.find(
      (pass) =>
        pass.cpf === cpf && !pass.isDeleted && pass.cpf === passenger.cpf,
    );

    if (!!passengerExists) {
      const passengerIndex = allPassengers.indexOf(passengerExists);
      passenger.isDeleted = allPassengers[passengerIndex].isDeleted;
      passenger.id = allPassengers[passengerIndex].id;
      allPassengers[passengerIndex] = passenger;
      await this.database.writePassengers(allPassengers);
      return passenger;
    } else if (passengerExists) {
      return null;
    } else {
      return null;
    }
  }

  public async findPassengerByCpf(cpf: string): Promise<Passenger> {
    const passengers = await this.database.getPassengers();
    const passenger = passengers.find(
      (passenger) => passenger.cpf === cpf && !passenger.isDeleted,
    );
    if (passenger) {
      delete passenger.isDeleted;
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
      const passengerSearch = passengers.filter(
        (passenger) =>
          passenger.nome.toUpperCase().includes(passengerName.toUpperCase()) &&
          !passenger.isDeleted,
      );
      passengerSearch.map((passenger) => delete passenger.isDeleted);
      return passengerSearch;
    }
    const activePassengers = passengers.filter(
      (passenger) => !passenger.isDeleted,
    );
    activePassengers.map((passenger) => delete passenger.isDeleted);
    return activePassengers.slice(
      (startPage - 1) * sizePage,
      startPage * sizePage,
    );
  }

  public async destroyPassenger(passengerId: string) {
    const passengers = await this.database.getPassengers();
    const passengerToDestroy = passengers.find(
      (passenger) => passenger.id === passengerId && !passenger.isDeleted,
    );
    const allTravels = await this.travelDatabase.getTravels();
    const someTravel = allTravels.filter(
      (travel) => travel.passengerId === passengerId,
    );
    const travelInProgress = someTravel.find(travel => travel.travelStatus === TravelStatus.CREATED || travel.travelStatus === TravelStatus.ACCEPTED);
    if (passengerToDestroy && !travelInProgress) {
      const passengerIndex = passengers.indexOf(passengerToDestroy);
      if (someTravel) {
        passengers[passengerIndex].isDeleted = true;
      } else {
        passengers.splice(passengerIndex, 1);
      }

      await this.database.writePassengers(passengers);
      delete passengerToDestroy.isDeleted;
      return passengerToDestroy;
    } else {
      return null;
    }
  }
}
