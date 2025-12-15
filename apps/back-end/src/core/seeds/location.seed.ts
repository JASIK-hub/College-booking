import { Repository } from 'typeorm';
import { LocationEntity } from '../db/entities/location.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class LocationSeed {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepo: Repository<LocationEntity>,
  ) {}

  async run() {
    const locations = [
      { name: 'Act hall' },
      { name: 'Football court' },
      { name: 'Volleyball court' },
      { name: 'Library' },
      { name: 'Techno Lab' },
    ];
    console.log('runned');
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
