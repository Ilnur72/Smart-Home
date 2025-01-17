import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserApartment extends BaseEntity {
  @Column()
  user_id: string;

  @Column()
  apartment_id: string;
}
