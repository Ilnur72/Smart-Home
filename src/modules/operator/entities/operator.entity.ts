import { ChildEntity, Column, OneToMany } from 'typeorm';
import { UserRole } from '../../../shared/types/enums';
import { OperatorUser } from '../../operator-users/entities/operatorUser.entity';
import { Building } from '../../building/entities/building.entity';
import { BaseUser } from '../../../shared/entities/base-staff.entity';

@ChildEntity()
export class Operator extends BaseUser {
  @Column({ enum: UserRole, default: UserRole.OPERATOR })
  role: UserRole;

  @OneToMany(() => OperatorUser, (operatorUser) => operatorUser.operator)
  operator_users: OperatorUser[];

  @OneToMany(() => Building, (building) => building.operator, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  buildings: Building[];
}
