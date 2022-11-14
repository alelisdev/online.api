import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entity/userEntity';
import { Team } from '../../teams/entities/teamEntity';
import { Meeting } from '../../meetings/entities/meetingEntity';

@Entity()
export class SalesRep {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, (user) => user.salesReps)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({ type: 'varchar', length: 36 })
  teamId: string;

  @ManyToOne(() => Team, (team) => team.salesReps)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: Team;

  @OneToMany(() => Meeting, (meeting) => meeting.salesRep)
  meetings: Meeting[];

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;

  @Column({ name: 'updated_at', default: () => 'now()' })
  updated_at?: Date;
}
