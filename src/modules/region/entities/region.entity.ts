// import { Building } from '../../../modules/building/entities/building.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { District } from '../../../modules/district/entities/district.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  region_id: string;

  @Column()
  name: string;

  @Column({ default: false, select: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // @OneToMany(() => Building, (building) => building.region)
  // buildings: Building[];

  @OneToMany(() => District, (district) => district.regions)
  district: District[];
}
