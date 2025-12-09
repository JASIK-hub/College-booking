import { IsString, Matches } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { LocationEntity } from './location.entity';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LocationEntity, (location) => location.bookings)
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column()
  status: 'booked' | 'free';
}
