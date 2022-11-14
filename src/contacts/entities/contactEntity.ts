import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 30,
  })
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  avatar: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  userId: string;

  @Column({ name: 'created_at', default: () => 'now()' })
  created_at?: Date;
}
