// import { Region } from '../../region/entities/region.entity';
import { District } from '../../district/entities/district.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  district_id: string;

  @Column()
  address: string;

  @Column()
  floor: number;

  @Column()
  entrance_number: number;

  @Column()
  operator_id: string;

  @Column({ default: false, select: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date;

  @ManyToOne(() => District, (district) => district.buildings)
  @JoinColumn({ name: 'district_id' })
  district: District;
}
