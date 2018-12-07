import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('boolean', { default: true })
  active: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('uuid', { nullable: true })
  bearer: string;

  @Column('uuid', { nullable: true })
  reset: string;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn()
  creator: User;
}
