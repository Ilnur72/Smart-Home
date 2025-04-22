import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { IntercomStatus } from '../../../shared/types/enums';
import { Entrance } from '../../entrance/entities/entrance.entity';

@Entity('intercom')
export class Intercom extends BaseEntity {
  @Column()
  model: string;

  @Column()
  device_ip: string;

  @Column()
  sip: string;

  @Column()
  stream_link: string;

  @Column()
  device_login: string;

  @Column()
  device_password: string;

  @Column()
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
