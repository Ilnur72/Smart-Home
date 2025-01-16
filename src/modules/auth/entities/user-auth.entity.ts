import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user-auth')
export class UserAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'text' })
  phone: string;

  @Column({ type: 'int' })
  sms_code: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
