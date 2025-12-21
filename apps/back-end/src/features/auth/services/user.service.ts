import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { RoleEnum } from 'src/core/db/enums/role.enum';
import { BaseService } from 'src/core/services/base-service';
import { Repository } from 'typeorm';
@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
  async upsertUser(data: { email: string; name: string; role: RoleEnum }) {
    let user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      user = this.userRepository.create({
        email: data.email,
        name: data.name,
        role: data.role,
      });
      await this.userRepository.save(user);
    } else {
      user.name = data.name;
      user.role = data.role;
      await this.userRepository.save(user);
    }

    return user;
  }
}
