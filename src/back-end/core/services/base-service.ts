import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity, ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseService<Entity extends ObjectLiteral> {
  constructor(
    @InjectRepository(Entity)
    protected repository: Repository<Entity>,
  ) {}

  async createOne(dto: Entity) {
    try {
      const createdObject = this.repository.create(dto);
      const savedObject = await this.repository.save(createdObject);
      return savedObject;
    } catch (error) {
      throw new BadRequestException('Ошибка при получении даныых');
    }
  }

  async findOne(dto: Entity) {
    try {
      const searchedEntity = this.repository.findOne({ where: { id: dto.id } });
      if (!searchedEntity) {
        throw new NotFoundException();
      }
      return searchedEntity;
    } catch (error) {
      throw new BadRequestException('Ошибка при получении даныых');
    }
  }
}
