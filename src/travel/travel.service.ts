import { DriverDatabase } from './../database/drivers/drivers.database';
import { Injectable } from '@nestjs/common';
import { TravelDatabase } from 'src/database/travels/travels.database';
import { Travel } from './travel.entity';
import { TravelStatus } from './travelSolicitations.enum';
import { Database } from 'src/database/passengers/passengers.database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TravelService {
  constructor(
    private travelDatabase: TravelDatabase,
    private database: Database,
    private driverDatabase: DriverDatabase,
  ) {}

  public async createTravel(travel: Travel): Promise<Travel> {
    const travelToCreate = travel;
    const allPassengers = await this.database.getPassengers();
    const idExists = allPassengers.find(
      (pass) => pass.id === travelToCreate.passengerId && !pass.isDeleted,
    );

    const allTravels = await this.travelDatabase.getTravels();
    const travelExists = allTravels.filter(
      (travel) => travel.passengerId === travelToCreate.passengerId,
    );

    const haveOpenTravels = travelExists.filter(
      (travel) =>
        travel.travelStatus === TravelStatus.CREATED ||
        travel.travelStatus === TravelStatus.ACCEPTED,
    );

    if (idExists && haveOpenTravels.length === 0) {
      travelToCreate.travelStatus = TravelStatus.CREATED;
      travelToCreate.travelId = uuidv4();
      travel.distance = Math.floor(Math.random() * (10 - 1) + 1);
      await this.travelDatabase.writeTravel(travelToCreate);
      return travelToCreate;
    }
    return null;
  }

  public async findTravelById(id: string): Promise<Travel> {
    const travels = await this.travelDatabase.getTravels();
    const travel = travels.find((travel) => travel.travelId === id);
    if (travel) {
      return travel;
    } else {
      return null;
    }
  }

  public async findAllTravels(
    page: number,
    size: number,
    travelStatus: number,
  ) {
    const startPage = page < 1 ? 1 : page;
    const sizePage = size < 0 ? 1 : size;
    const trvStatus = travelStatus || '';
    const travels = await this.travelDatabase.getTravels();

    if (trvStatus) {
      const travelSearch = travels.filter(
        (travel) => travel.travelStatus == trvStatus,
      );
      return travelSearch;
    }

    return travels.slice((startPage - 1) * sizePage, startPage * sizePage);
  }

  public async findNearbyTravels(driverId: string, travelDistance: number) {
    const allDrivers = await this.driverDatabase.getDrivers();
    const driverExist = allDrivers.find(
      (driver) =>
        driver.id === driverId && !driver.isBlocked && !driver.isDeleted,
    );
    if (driverExist) {
      const allTravels = await this.travelDatabase.getTravels();
      const nearbyTravels = allTravels.filter(
        (travel) =>
          travel.distance <= travelDistance &&
          !travel.driverId &&
          !travel.travelStatus,
      );
      return nearbyTravels;
    }
    return null;
  }

  public async updateStatusTravel(
    travelId: string,
    driverId: string,
    travelStatus: number,
  ) {
    const allDrivers = await this.driverDatabase.getDrivers();
    const driverIsActive = allDrivers.find((driver) => {
      if (driver.id === driverId && !driver.isBlocked && !driver.isDeleted) {
        return driver;
      }
    });
    const allTravels = await this.travelDatabase.getTravels();
    const travelToUpdate = allTravels.find(
      (travel) =>
        travel.travelId === travelId &&
        (travel.driverId === driverId || !travel.driverId),
    );

    if (travelToUpdate && driverIsActive) {
      const travelIndex = allTravels.indexOf(travelToUpdate);
      if (travelStatus === 0) {
        return null;
      } else if (
        travelStatus === 1 &&
        travelToUpdate.travelStatus === TravelStatus.CREATED
      ) {
        allTravels[travelIndex].travelStatus = TravelStatus.ACCEPTED;
      } else if (
        travelStatus === 2 &&
        travelToUpdate.travelStatus === TravelStatus.ACCEPTED
      ) {
        allTravels[travelIndex].travelStatus = TravelStatus.REFUSED;
      } else if (
        travelStatus === 3 &&
        travelToUpdate.travelStatus === TravelStatus.ACCEPTED
      ) {
        allTravels[travelIndex].travelStatus = TravelStatus.DONE;
      } else {
        return null;
      }
      travelToUpdate.driverId = driverIsActive.id;
      await this.travelDatabase.writeTravels(allTravels);
      return travelToUpdate;
    } else {
      return null;
    }
  }
}
