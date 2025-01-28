import { Apartment } from '../../apartment/entities/apartment.entity';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class UserApartment extends BaseEntity {
  @Column()
  user_id: string;

  @Column()
  apartment_id: string;

  @ManyToOne(() => User, (user) => user.userApartments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Apartment, (apartment) => apartment.userApartments)
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;
}
