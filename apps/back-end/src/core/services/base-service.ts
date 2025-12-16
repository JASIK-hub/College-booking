import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  Entity,
  ObjectLiteral,
  Repository,
  FindOneOptions,
  FindOptionsWhere,
  DeepPartial,
  FindManyOptions,
} from 'typeorm';

export abstract class BaseService<Entity extends ObjectLiteral> {
  constructor(
    @InjectRepository(Entity)
    protected repository: Repository<Entity>,
  ) {}

  async createOne(dto: DeepPartial<Entity>) {
    try {
      const createdObject = this.repository.create(dto);
      const savedObject = await this.repository.save(createdObject);
      return savedObject;
    } catch (error) {
      throw new BadRequestException('Error while fetching data');
    }
  }

  async findOne(id?: number, options?: FindOneOptions<Entity>) {
    try {
      const whereCondition = {
        id,
        ...options?.where,
      } as FindOptionsWhere<Entity>;
      const searchedEntity = this.repository.findOne({
        ...options,
        where: whereCondition,
      });
      if (!searchedEntity) {
        throw new NotFoundException();
      }
      return searchedEntity;
    } catch (error) {
      throw new BadRequestException('Error while fetching data');
    }
  }

  async findOneBy(options: FindOptionsWhere<Entity>) {
    try {
      const searchedEntity = this.repository.findOneBy(options);
      if (!searchedEntity) {
        throw new NotFoundException();
      }
      return searchedEntity;
    } catch (error) {
      throw new BadRequestException('Error while fetching data');
    }
  }
  async findAll(options?: FindManyOptions<Entity>) {
    try {
      const allUsers = await this.repository.find(options);
      if (!allUsers) {
        throw new NotFoundException();
      }
      return allUsers;
    } catch (error) {
      throw new BadRequestException('Error while fetching data');
    }
  }

  async updateOne(id: number, dto: DeepPartial<Entity>) {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    this.repository.update(id, dto as any);
    return await this.repository.findOne({ where: { id } as any });
  }
}
