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
  ) {}

  public async createTravel(travel: Travel): Promise<Travel> {
    const travelToCreate = travel;
    const allPassengers = await this.database.getPassengers();
    const idExists = allPassengers.find(
      (pass) => pass.id === travelToCreate.passengerId,
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

  public async findTravels(page: number, size: number, travelStatus: number) {
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

  public async updateStatusTravel(travelId: string, travelStatus: number) {
    const allTravels = await this.travelDatabase.getTravels();
    const travelToUpdate = allTravels.find(
      (travel) => travel.travelId === travelId,
    );
    if (travelToUpdate) {
      const travelIndex = allTravels.indexOf(travelToUpdate);
      switch (travelStatus) {
        case 1:
          allTravels[travelIndex].travelStatus = TravelStatus.ACCEPTED;
          break;
        case 2:
          allTravels[travelIndex].travelStatus = TravelStatus.REFUSED;
          break;
        case 3:
          allTravels[travelIndex].travelStatus = TravelStatus.DONE;
          break;
        default:
          return null;
      }

      await this.travelDatabase.writeTravels(allTravels);
      return travelToUpdate;
    } else {
      return null;
    }
  }
}
