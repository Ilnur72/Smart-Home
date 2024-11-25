import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { UserRole } from '../../../shared/types/enums';
import { OperatorUser } from 'src/modules/operator-users/entities/operatorUser.entity';
import { Building } from 'src/modules/building/entities/building.entity';
import { SystemUser } from 'src/modules/system-users/entities/systemUser.entity';

@Entity()
export class Operator extends BaseEntity {
  @Column({ enum: UserRole, default: UserRole.OPERATOR })
  role: UserRole;

  @Column()
  name: string;

  @Column({ unique: true })
  login: string;

  @Column({ nullable: true, select: false })
  password: string;

  @OneToMany(() => OperatorUser, (operatorUser) => operatorUser.operator)
  operator_users: OperatorUser[];

  @OneToMany(() => SystemUser, (systemUser) => systemUser.operator)
  system_users: SystemUser[];

  @OneToMany(() => Building, (building) => building.operator)
  buildings: Building[];
}
