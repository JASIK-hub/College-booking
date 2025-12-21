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
import { BookingStatusEnum } from '../enums/booking-status.enum';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LocationEntity, (location) => location.bookings)
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'enum', enum: BookingStatusEnum })
  status: BookingStatusEnum;

  @Column({ type: 'timestamp', nullable: true })
  pendingStartTime?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  pendingEndTime?: Date | null;
}
