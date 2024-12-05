import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Building } from '../../building/entities/building.entity';
import { CameraStatus } from '../../../shared/types/enums';

@Entity('camera')
export class Camera extends BaseEntity {
  @Column()
  building_id: string;

  @Column()
  model: string;

  @Column('json')
  location: Record<string, any>;

  @Column()
  ip_address: string;

  @Column()
  stream_link: string;

  @Column({
    type: 'enum',
    enum: CameraStatus,
    default: CameraStatus.ACTIVE,
  })
  status: CameraStatus;

  @ManyToOne(() => Building, (building) => building.cameras)
  @JoinColumn({ name: 'building_id' })
  buildings: Building;
}
