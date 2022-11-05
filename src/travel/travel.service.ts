import { Injectable } from '@nestjs/common';
import { TravelDatabase } from 'src/database/travels/travels.database';
import { Travel } from './travel.entity';
import { TravelStatus } from './travelSolicitations.enum';
import { Database } from 'src/database/passengers/passengers.database';

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
      (pass) => pass.id === travelToCreate.id,
    );

    const alltravels = await this.travelDatabase.getTravels();
    const travelExist = alltravels.filter(
      (drv) => drv.id === travelToCreate.id,
    );
    const haveOpenTravels = travelExist.filter(
      (travel) =>
        travel.travelStatus === TravelStatus.CREATED ||
        travel.travelStatus === TravelStatus.ACCEPTED,
    );

    if (idExists && haveOpenTravels.length < 1) {
      travelToCreate.travelStatus = TravelStatus.CREATED;
      await this.travelDatabase.writeTravel(travelToCreate);
      return travelToCreate;
    }
    return null;
  }

  public async updateTravel(id: string, travel: Travel) {
    const allTravels = await this.travelDatabase.getTravels();
    const travelExists = allTravels.find((pass) => pass.id === id);
    const idIsEqual = travel.id === id;
    const idExists = allTravels.find((pass) => pass.id === travel.id);
    if (!!travelExists && (!!idIsEqual || !idExists)) {
      const travelIndex = allTravels.indexOf(travelExists);
      allTravels[travelIndex] = travel;
      await this.travelDatabase.writeTravels(allTravels);
      return travel;
    } else if (travelExists) {
      return null;
    } else {
      return null;
    }
  }

  public async searchById(id: string): Promise<Travel> {
    const travels = await this.travelDatabase.getTravels();
    const travel = travels.find((travel) => travel.id === id);
    if (travel) {
      return travel;
    } else {
      return null;
    }
  }

  public async findTravels(page: number, size: number, name: string) {
    const startPage = page < 1 ? 1 : page;
    const sizePage = size < 0 ? 1 : size;
    const travelName = name || '';
    const travels = await this.travelDatabase.getTravels();

    if (travelName) {
      const travelSearch = travels.filter((travel) =>
        travel.origin.toUpperCase().includes(travelName.toUpperCase()),
      );
      return travelSearch;
    }

    return travels.slice((startPage - 1) * sizePage, startPage * sizePage);
  }
}
