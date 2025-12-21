import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../enums/role.enum';
import { NotificationEntity } from './notification.entity';
import { BookingEntity } from './booking.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({})
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false, enum: RoleEnum })
  role: RoleEnum;

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings: BookingEntity[];
}
