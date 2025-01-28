import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../shared/types/enums';
import { UserApartment } from 'src/modules/user-apartment/entities/user-apartment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  fullname: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  staff_id: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ default: false, select: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date;

  // @ManyToOne(() => Region, (region) => region.users)
  // @JoinColumn({ name: 'regionId' })
  // region: Region;

  @OneToMany(() => UserApartment, (userApartment) => userApartment.user)
  userApartments: UserApartment[];
}
