import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('linksEntity')
export class LinksEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  target!: string;

  @Column()
  link!: string;

  @Column({ default: 0 })
  redirects!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({nullable: true})
  passwordHash!: string | null;

  @Column({nullable: true})
  expireAt!: Date | null;
}
