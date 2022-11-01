import { Injectable } from '@nestjs/common';
import { writeFile, readFile } from 'fs/promises';
import { Beer } from 'src/beer/beer.entity';

@Injectable()
export class Database {
  private FILENAME = 'beers.json';

  public async getBeers(): Promise<Beer[]> {
    const beersInFile = await readFile(this.FILENAME, 'utf-8');
    const beers = JSON.parse(beersInFile);
    return beers;
  }

  public async writeBeer(beer: Beer) {
    let beers: Beer[] = await this.getBeers();
    if (!beers) {
      beers = [];
    }
    await writeFile(this.FILENAME, JSON.stringify([...beers, beer]));
  }

  public async writeBeers(beers: Beer[]) {
    await writeFile(this.FILENAME, JSON.stringify(beers));
  }
}
