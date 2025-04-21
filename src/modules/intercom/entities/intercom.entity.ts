import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { IntercomStatus } from '../../../shared/types/enums';
import { Entrance } from '../../entrance/entities/entrance.entity';

@Entity('intercom')
export class Intercom extends BaseEntity {
  @Column()
  model: string;

  @Column({ nullable: true })
  device_ip: string;

  @Column({ nullable: true })
  sip: string;

  @Column({ nullable: true })
  stream_link: string;

  @Column({ nullable: true })
  device_login: string;

  @Column({ nullable: true })
  device_password: string;

  @Column({ nullable: true })
  entrance_id: string;

  @Column({
    type: 'enum',
    enum: IntercomStatus,
    default: IntercomStatus.ACTIVE,
  })
  status: IntercomStatus;

  @OneToOne(() => Entrance, (entrance) => entrance.intercom)
  @JoinColumn({ name: 'entrance_id' })
  entrance: Entrance;
}
