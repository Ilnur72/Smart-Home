import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Building } from '../../building/entities/building.entity';
import { Intercom } from '../../intercom/entities/intercom.entity';
import { Apartment } from '../../apartment/entities/apartment.entity';

@Entity()
export class Entrance extends BaseEntity {
  @Column()
  building_id: string;

  @Column()
  intercom_id: string;

  @Column()
  entrance_number: number;

  @ManyToOne(() => Building, (building) => building.entrances)
  @JoinColumn({ name: 'building_id' })
  buildings: Building;

  @ManyToOne(() => Intercom, (intercom) => intercom.entrances)
  @JoinColumn({ name: 'intercom_id' })
  intercom: Intercom;

  @OneToMany(() => Apartment, (apartment) => apartment.entrance)
  apartments: Apartment[];
}
