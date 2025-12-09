import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from 'src/back-end/core/db/entities/location.entity';
import { BaseService } from 'src/back-end/core/services/base-service';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService extends BaseService<LocationEntity> {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepo: Repository<LocationEntity>,
  ) {
    super(locationRepo);
  }
}
