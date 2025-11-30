import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'first name', type: String })
  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @ApiProperty({ description: 'last name', type: String })
  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  password: string;

  @ApiProperty()
  @Column()
  phone: string;
}
