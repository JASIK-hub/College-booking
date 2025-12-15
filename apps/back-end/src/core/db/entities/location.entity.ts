import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookingEntity } from './booking.entity';

@Entity('location')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => BookingEntity, (booking) => booking.location)
  bookings: BookingEntity[];
}
