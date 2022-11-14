import { Meeting } from '../../meetings/entities/meetingEntity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SalesRep } from '../../salesReps/entities/salesRepEntity';
import { User } from '../../users/entity/userEntity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, (user) => user.teams)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => SalesRep, (salesRep) => salesRep.team)
  salesReps: SalesRep[];

  @OneToMany(() => Meeting, (meeting) => meeting.team)
  meetings: Meeting[];

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;

  @Column({ name: 'updated_at', default: () => 'now()' })
  updated_at?: Date;
}
