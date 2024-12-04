import { ChildEntity, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
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

  @OneToMany(() => Building, (building) => building.operator)
  buildings: Building[];
}

// @Entity()
// export class Operator extends BaseEntity {
//   @Column({ enum: UserRole, default: UserRole.OPERATOR })
//   role: UserRole;

//   @Column()
//   name: string;

//   @Column({ unique: true })
//   login: string;

//   @Column({ nullable: true, select: false })
//   password: string;

//   @OneToMany(() => OperatorUser, (operatorUser) => operatorUser.operator)
//   operator_users: OperatorUser[];

//   @OneToMany(() => Building, (building) => building.operator)
//   buildings: Building[];
// }
