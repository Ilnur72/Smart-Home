import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { UserRole } from '../../../shared/types/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ enum: UserRole, default: UserRole.USER })
  // role: UserRole;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  apartmentId: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ default: false, select: false })
  isDeleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  deletedAt: Date;

  // @ManyToOne(() => Region, (region) => region.users)
  // @JoinColumn({ name: 'regionId' })
  // region: Region;
}
