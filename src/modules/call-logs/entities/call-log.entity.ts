// import { Apartment } from 'src/modules/apartment/entities/apartment.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

// @Entity()
// export class CallLogs extends BaseEntity {
//   @Column()
//   phone: string;

//   @Column()
//   apartment_id: string;

//   @Column()
//   user_id: string;

//   @ManyToOne(() => Apartment, (apartment) => apartment.logCalls)
//   @JoinColumn({ name: 'apartment_id' })
//   apartment: Apartment;
// }

@Entity('callLog')
export class CallLog extends BaseEntity {
  @Column({ enum: ['Cancelled', 'Busy', 'Answered', 'Ringing'] })
  status: 'Cancelled' | 'Busy' | 'Answered' | 'Ringing';

  @Column('json')
  data: {
    Caller: number;
    Dest: number;
    startTime: string;
    endTime: string;
    answerTime: string;
    duration: number;
    billAbleSeconds: number;
  };
}
