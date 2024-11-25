import { Building } from '../../building/entities/building.entity';
import { Region } from '../../region/entities/region.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity()
export class District extends BaseEntity {
  @Column({ nullable: true, select: false })
  district_id: string;

  @Column({ nullable: true })
  region_id: string;

  @Column()
  name: string;

  @OneToMany(() => Building, (building) => building.district)
  buildings: Building[];

  @ManyToOne(() => Region, (region) => region.district)
  @JoinColumn({ name: 'region_id' })
  region: Region;
}
