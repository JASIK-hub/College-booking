import { Repository } from 'typeorm';
import { LocationEntity } from '../db/entities/location.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationsEnum } from '../db/enums/locations-enum.dto';
@Injectable()
export class LocationSeed {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepo: Repository<LocationEntity>,
  ) {}

  async run() {
    const locations = [
      { name: LocationsEnum.ACT_HALL },
      { name: LocationsEnum.FOOTBALL_COURT },
      { name: LocationsEnum.VOLLEYBALL_COURT },
      { name: LocationsEnum.LIBRARY },
      { name: LocationsEnum.TECHNO_LAB },
    ];
    for (const location of locations) {
      const exists = await this.locationRepo.findOne({
        where: { name: location.name },
      });
      if (!exists) {
        await this.locationRepo.save(location);
      }
    }
  }
}
