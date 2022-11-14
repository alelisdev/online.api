import { Call } from '../../calls/entities/callEntity';
import { Recording } from '../../recordings/entities/recordingEntity';
import { SalesRep } from '../../salesReps/entities/salesRepEntity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Team } from '../../teams/entities/teamEntity';
import { User } from '../../users/entity/userEntity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ name: 'start' })
  start: Date;

  @Column({ name: 'end' })
  end: Date;

  @ManyToOne(() => Team, (team) => team.meetings)
  @JoinColumn({ name: 'teamId', referencedColumnName: 'id' })
  team: Team;

  @Column({ name: 'teamId', length: 36, nullable: true })
  teamId: string;

  @OneToMany(() => Recording, (recording) => recording.meeting)
  recordings: Recording[];

  @OneToMany(() => Call, (call) => call.meeting)
  calls: Call[];

  @ManyToOne(() => User, (user) => user.meetingCreators)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  // Creator
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => SalesRep, (salesRep) => salesRep.meetings)
  @JoinColumn({ name: 'salesRepId', referencedColumnName: 'id' })
  salesRep: SalesRep;

  // Assignee
  @Column({ type: 'varchar', length: 36, nullable: true })
  salesRepId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
