import { Meeting } from '../../meetings/entities/meetingEntity';
import { User } from '../../users/entity/userEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'recordings' })
export class Recording {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar' })
  session_id: string;

  @Column({ length: 36 })
  meeting_id: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.recordings)
  @JoinColumn({ name: 'meeting_id', referencedColumnName: 'id' })
  meeting: Meeting;

  @Column({ type: 'varchar', nullable: true })
  file_path: string;

  @Column({ length: 36 })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;

  @Column({ name: 'updated_at', default: () => 'now()' })
  updated_at?: Date;

  @Column({ length: 10, nullable: true })
  attentionLvl: string;
}
