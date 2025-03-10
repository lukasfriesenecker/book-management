import { User } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryColumn({ length: 13 })
  isbn: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  user: User;
}
