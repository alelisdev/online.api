import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transcriptions' })
export class Transcription {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: false })
  meeting_id: string;

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;

  @Column({ type: 'text', nullable: true })
  transcription: string;

  @Column({ nullable: true })
  confidence: number;

  @Column({ nullable: true })
  isTalkingPoint: boolean;
}
