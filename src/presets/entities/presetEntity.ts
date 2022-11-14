import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Preset {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar' })
  drugName: string;

  @Column({ type: 'text', nullable: true })
  manufacturer: string;

  @Column({ type: 'text', nullable: true })
  usageTitle: string;

  @Column({ type: 'text', nullable: true })
  usageKeywords: string;

  @Column({ type: 'text', nullable: true })
  dosageAndAdministrationTitle: string;

  @Column({ type: 'text', nullable: true })
  dosageAndAdministrationKeywords: string;

  @Column({ type: 'text', nullable: true })
  dosageFormsTitle: string;

  @Column({ type: 'text', nullable: true })
  dosageFormsKeywords: string;

  @Column({ type: 'text', nullable: true })
  contraindicationsTitle: string;

  @Column({ type: 'text', nullable: true })
  contraindicationsKeywords: string;

  @Column({ type: 'text', nullable: true })
  warningsTitle: string;

  @Column({ type: 'text', nullable: true })
  warningsKeywords: string;

  @Column({ type: 'text', nullable: true })
  adverseReactionsTitle: string;

  @Column({ type: 'text', nullable: true })
  adverseReactionsKeywords: string;

  @Column({ type: 'text', nullable: true })
  drugInteractionsTitle: string;

  @Column({ type: 'text', nullable: true })
  drugInteractionsKeywords: string;

  @Column({ type: 'text', nullable: true })
  lactationTitle: string;

  @Column({ type: 'text', nullable: true })
  lactationKeywords: string;

  @Column({ type: 'text', nullable: true })
  discussionFirstTitle?: string;

  @Column({ type: 'text', nullable: true })
  discussionFirstKeywords?: string;

  @Column({ type: 'text', nullable: true })
  discussionSecondTitle?: string;

  @Column({ type: 'text', nullable: true })
  discussionSecondKeywords?: string;

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;
}
