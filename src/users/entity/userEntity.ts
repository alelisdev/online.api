import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Team } from '../../teams/entities/teamEntity';
import { SalesRep } from '../../salesReps/entities/salesRepEntity';
import { Exclude } from 'class-transformer';
import { Meeting } from '../../meetings/entities/meetingEntity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 30,
  })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ length: 10, type: 'varchar' })
  role: string;

  @Column({ length: 10, type: 'varchar' })
  status: string;

  @Column({ length: 250, type: 'varchar', nullable: true })
  avatar: string;

  @Column({ length: 250, type: 'varchar', nullable: true })
  background: string;

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;

  @OneToMany(() => Team, (team) => team.user)
  teams: Team[];

  @OneToMany(() => SalesRep, (salesRep) => salesRep.user)
  salesReps: SalesRep[];

  @OneToMany(() => Meeting, (meeting) => meeting.user)
  meetingCreators: Meeting[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
