import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { UserRole } from '../../../shared/types/enums';
import { Operator } from 'src/modules/operator/entities/operator.entity';

@Entity('system_users')
export class SystemUser extends BaseEntity {
  @Column()
  name: string;

  @Column()
  operator_id: string;

  @Column({ enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Column({ unique: true })
  login: string;

  @Column({ nullable: true, select: false })
  password: string;

  @ManyToOne(() => Operator, (operator) => operator.system_users)
  @JoinColumn({ name: 'operator_id' })
  operator: Operator;
}
