import { Building } from '../../building/entities/building.entity';
import { Region } from '../../region/entities/region.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class District {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  district_id: string;

  @Column({ nullable: true })
  region_id: string;

  @Column()
  name: string;

  @Column({ default: false, select: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Building, (building) => building.district)
  buildings: Building[];

  @ManyToOne(() => Region, (region) => region.district)
  @JoinColumn({ name: 'region_id' })
  regions: Region;
}
