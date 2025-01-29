import { ChildEntity, Column } from 'typeorm';
import { UserRole } from '../../../shared/types/enums';
import { BaseUser } from '../../../shared/entities/base-staff.entity';

@ChildEntity('system_users')
export class SystemUser extends BaseUser {
  // @Column()
  // name: string;

  @Column({ enum: UserRole, default: UserRole.SYSTEM_ADMIN })
  role: UserRole;

  // @Column({ unique: true })
  // email: string;

  // @Column({ nullable: true, select: false })
  // password: string;
}
