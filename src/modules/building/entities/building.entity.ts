import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Operator } from 'src/modules/operator/entities/operator.entity';
import { District } from '../../district/entities/district.entity';
import { Camera } from 'src/modules/camera/entities/camera.entity';
import { Entrance } from 'src/modules/entrance/entities/entrance.entity';

@Entity()
export class Building extends BaseEntity {
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

  @ManyToOne(() => District, (district) => district.buildings)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Operator, (operator) => operator.buildings)
  @JoinColumn({ name: 'operator_id' })
  operator: Operator;

  @OneToMany(() => Entrance, (entrance) => entrance.buildings)
  entrances: Entrance[];

  @OneToMany(() => Camera, (camera) => camera.buildings)
  cameras: Camera[];
}
