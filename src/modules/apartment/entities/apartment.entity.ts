import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Entrance } from 'src/modules/entrance/entities/entrance.entity';
import { Intercom } from 'src/modules/intercom/entities/intercom.entity';
// import { Entrance } from '../../entrance/entities/entrance.entity';
// import { Intercom } from '../../intercom/entities/intercom.entity';

@Entity('apartment')
export class Apartment extends BaseEntity {
  @Column()
  entrance_id: string;

  @Column()
  intercom_id: string;

  // @Column()
  // apartments_number: number;

  @Column()
  number: number;

  @ManyToOne(() => Entrance, (entrance) => entrance.apartments)
  @JoinColumn({ name: 'entrance_id' })
  entrance: Entrance;

  @ManyToOne(() => Intercom)
  @JoinColumn({ name: 'intercom_id' })
  intercom: Intercom;
}
