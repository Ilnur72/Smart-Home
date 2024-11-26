import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { District } from '../../district/entities/district.entity';

@Entity()
export class Region extends BaseEntity {
  @Column({ nullable: true, select: false })
  region_id: string;

  @Column()
  name: string;

  @OneToMany(() => District, (district) => district.region)
  district: District[];
}
