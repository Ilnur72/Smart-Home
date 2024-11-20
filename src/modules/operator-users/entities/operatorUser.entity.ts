import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../shared/types/enums';

@Entity()
export class OperatorUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  operator_id: string;

  @Column({ enum: UserRole, default: UserRole.OPERATOR })
  role: UserRole;

  @Column()
  name: string;

  @Column()
  login: string;

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
}
