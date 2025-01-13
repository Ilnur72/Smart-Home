import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Entrance } from '../../entrance/entities/entrance.entity';
import { Intercom } from '../../intercom/entities/intercom.entity';

@Entity('apartment')
export class Apartment extends BaseEntity {
  @Column()
  entrance_id: string;

  @Column({ nullable: true })
  intercom_id?: string;

  @Column()
  number: string;

  @ManyToOne(() => Entrance, (entrance) => entrance.apartments)
  @JoinColumn({ name: 'entrance_id' })
  entrance: Entrance;

  @ManyToOne(() => Intercom)
  @JoinColumn({ name: 'intercom_id' })
  intercom: Intercom;
}
