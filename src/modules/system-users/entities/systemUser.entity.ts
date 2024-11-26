import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { UserRole } from '../../../shared/types/enums';

@Entity('system_users')
export class SystemUser extends BaseEntity {
  @Column()
  name: string;

  @Column({ enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Column({ unique: true })
  login: string;

  @Column({ nullable: true, select: false })
  password: string;
}
