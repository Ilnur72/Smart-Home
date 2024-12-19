import { ChildEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { UserRole } from '../../../shared/types/enums';
import { Operator } from '../../operator/entities/operator.entity';
import { BaseUser } from '../../../shared/entities/base-staff.entity';

@ChildEntity('operator_user')
export class OperatorUser extends BaseUser {
  @Column({ enum: UserRole, default: UserRole.OPERATOR_USER })
  role: UserRole;

  @ManyToOne(() => Operator, (operator) => operator.operator_users)
  @JoinColumn({ name: 'operator_id' })
  operator: Operator;
}

// @Entity()
// export class OperatorUser extends BaseEntity {
//   @Column()
//   operator_id: string;

//   @Column({ enum: UserRole, default: UserRole.OPERATOR_USER })
//   role: UserRole;

//   @Column()
//   name: string;

//   @Column()
//   email: string;

//   @Column({ nullable: true, select: false })
//   password: string;

//   @ManyToOne(() => Operator, (operator) => operator.operator_users)
//   @JoinColumn({ name: 'operator_id' })
//   operator: Operator;
// }
