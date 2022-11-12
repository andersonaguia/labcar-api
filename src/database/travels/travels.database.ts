import { Injectable } from '@nestjs/common';
import { writeFile, readFile } from 'fs/promises';
import { Travel } from 'src/travel/travel.entity';

@Injectable()
export class TravelDatabase {
  private FILENAME = 'travels.json';

  public async getTravels(): Promise<Travel[]> {
    const travelsInFile = await readFile(this.FILENAME, 'utf-8');
    const travels = JSON.parse(travelsInFile);
    return travels;
  }

  public async writeTravel(travel: Travel) {
    let travels: Travel[] = await this.getTravels();
    if (!travels) {
      travels = [];
    }
    await writeFile(this.FILENAME, JSON.stringify([...travels, travel]));
  }

  public async writeTravels(travels: Travel[]) {
    await writeFile(this.FILENAME, JSON.stringify(travels));
  }
}
