import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Building {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  region_id: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  entrance_number: string;

  @Column({ nullable: true })
  operator_id: string;

  @Column({ default: false, select: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date;

  // @OneToMany(() => Operator, (operator) => operator.district)
  // operators: Operator[];
}
