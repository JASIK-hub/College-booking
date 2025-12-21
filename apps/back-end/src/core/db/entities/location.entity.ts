import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocationsEnum } from '../enums/locations.enum';
import { BookingEntity } from './booking.entity';

@Entity('location')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: LocationsEnum,
    nullable: false,
  })
  name: LocationsEnum;

  @OneToMany(() => BookingEntity, (booking) => booking.location)
  bookings: BookingEntity[];
}
