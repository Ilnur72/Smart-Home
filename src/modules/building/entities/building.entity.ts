import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Operator } from '../../operator/entities/operator.entity';
import { District } from '../../district/entities/district.entity';
import { Camera } from '../../camera/entities/camera.entity';
import { Entrance } from '../../entrance/entities/entrance.entity';

@Entity()
export class Building extends BaseEntity {
  @Column()
  district_id: string;

  @Column()
  address: string;

  @Column()
  floor: number;

  @Column({ nullable: true })
  entrance_count: number;

  @Column({ nullable: true })
  apartments_count: number;

  @Column({ nullable: true })
  operator_id: string;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => District, (district) => district.buildings)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Operator, (operator) => operator.buildings)
  @JoinColumn({ name: 'operator_id' })
  operator: Operator;

  @OneToMany(() => Entrance, (entrance) => entrance.buildings, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  entrances: Entrance[];

  @OneToMany(() => Camera, (camera) => camera.buildings)
  cameras: Camera[];
}
