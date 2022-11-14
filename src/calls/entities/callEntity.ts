import { Meeting } from '../../meetings/entities/meetingEntity';
import { User } from '../../users/entity/userEntity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'calls' })
export class Call {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar', length: 36 })
  meeting_id: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.calls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_id', referencedColumnName: 'id' })
  meeting: Meeting;

  @Column({ type: 'varchar', length: 36 })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  client: string;

  @Column({ name: 'started_at', nullable: true })
  started_at?: Date;

  @Column({ name: 'ended_at', nullable: true })
  ended_at?: Date;

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;

  @Column({ name: 'updated_at', default: () => 'now()' })
  updated_at?: Date;
}
