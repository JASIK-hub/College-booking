import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, select: false })
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings: BookingEntity[];
}
