import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

}
