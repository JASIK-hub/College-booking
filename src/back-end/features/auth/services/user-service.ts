import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/back-end/core/db/entities/user-entity';
import { BaseService } from 'src/back-end/core/services/base-service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
