import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { UserRole } from '../../../shared/types/enums';
import { Operator } from '../../operator/entities/operator.entity';

@Entity()
export class OperatorUser extends BaseEntity {
  @Column()
  operator_id: string;

  @Column({ enum: UserRole, default: UserRole.OPERATOR_USER })
  role: UserRole;

  @Column()
  name: string;

  @Column()
  login: string;

  @Column({ nullable: true, select: false })
  password: string;

  @ManyToOne(() => Operator, (operator) => operator.operator_users)
  @JoinColumn({ name: 'operator_id' })
  operator: Operator;
}
