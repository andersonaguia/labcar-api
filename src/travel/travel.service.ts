import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/travels/travels.database';
import { Travel } from './travel.entity';
import { TravelStatus } from './travelSolicitations.enum';

@Injectable()
export class TravelService {
  constructor(private database: Database) {}

  public async createTravel(travel: Travel): Promise<Travel> {
    const travelToCreate = travel;
    travelToCreate.id = travelToCreate.id.replace(/\D/g, '');
    const alltravels = await this.database.getTravels();
    const travelExist = alltravels.filter(
      (drv) => drv.id === travelToCreate.id,
    );
    if (travelExist) {
      return null;
    }
    travelToCreate.travelStatus = TravelStatus.CREATED;
    await this.database.writeTravel(travelToCreate);
    return travelToCreate;
  }

  public async updateTravel(id: string, travel: Travel) {
    const allTravels = await this.database.getTravels();
    const travelExists = allTravels.find((pass) => pass.id === id);
    const idIsEqual = travel.id === id;
    const idExists = allTravels.find((pass) => pass.id === travel.id);
    if (!!travelExists && (!!idIsEqual || !idExists)) {
      const travelIndex = allTravels.indexOf(travelExists);
      allTravels[travelIndex] = travel;
      await this.database.writeTravels(allTravels);
      return travel;
    } else if (travelExists) {
      return null;
    } else {
      return null;
    }
  }

  public async searchById(id: string): Promise<Travel> {
    const travels = await this.database.getTravels();
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
    const travels = await this.database.getTravels();

    if (travelName) {
      const travelSearch = travels.filter((travel) =>
        travel.origin.toUpperCase().includes(travelName.toUpperCase()),
      );
      return travelSearch;
    }

    return travels.slice((startPage - 1) * sizePage, startPage * sizePage);
  }

  public async destroyTravel(id: string) {
    const travels = await this.database.getTravels();
    const travelToDestroy = travels.find((drv) => drv.id === id);
    if (travelToDestroy) {
      const travelIndex = travels.indexOf(travelToDestroy);
      travels.splice(travelIndex, 1);
      await this.database.writeTravels(travels);
      return travelToDestroy;
    } else {
      return null;
    }
  }
}
