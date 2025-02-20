import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { IntercomStatus } from '../../../shared/types/enums';
import { Entrance } from '../../entrance/entities/entrance.entity';

@Entity('intercom')
export class Intercom extends BaseEntity {
  @Column()
  model: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  sip: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: IntercomStatus,
    default: IntercomStatus.ACTIVE,
  })
  status: IntercomStatus;

  @OneToOne(() => Entrance, (entrance) => entrance.intercom)
  entrance: Entrance;
}
