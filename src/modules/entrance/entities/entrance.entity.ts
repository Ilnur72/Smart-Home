import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Building } from '../../building/entities/building.entity';
import { Intercom } from '../../intercom/entities/intercom.entity';
import { Apartment } from '../../apartment/entities/apartment.entity';

@Entity()
export class Entrance extends BaseEntity {
  @Column()
  building_id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  intercom_id: string;

  @Column({ type: 'int', nullable: true })
  first_apartment_number?: number;

  @Column({ type: 'int', nullable: true })
  last_apartment_number?: number;

  @Column('text', { array: true, nullable: true })
  camera_ids: string[];

  @Column({ nullable: true })
  intercom_ip: string;

  @Column({ nullable: true })
  intercom_login: string;

  @Column({ nullable: true })
  intercom_password: string;

  @Column({ nullable: true })
  stream_ip: string;

  @ManyToOne(() => Building, (building) => building.entrances)
  @JoinColumn({ name: 'building_id' })
  buildings: Building;

  @OneToOne(() => Intercom, (intercom) => intercom.entrance, {
    nullable: true,
  })
  @JoinColumn({ name: 'intercom_id' })
  intercom: Intercom;

  @OneToMany(() => Apartment, (apartment) => apartment.entrance, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  apartments: Apartment[];
}
