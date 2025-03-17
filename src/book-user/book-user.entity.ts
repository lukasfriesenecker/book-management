import { Book } from 'src/book/book.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

export enum Status {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

@Entity()
export class BookUser {
  @PrimaryColumn({ length: 13 })
  isbn: string;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: Status, default: Status.UNREAD })
  status: Status;
}
