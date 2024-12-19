import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { UserRole } from '../types/enums';

@Entity('staff')
@TableInheritance({ column: { type: 'varchar', name: 'staff_type' } })
export class BaseUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: UserRole;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
