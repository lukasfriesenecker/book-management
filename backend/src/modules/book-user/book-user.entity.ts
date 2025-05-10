import { Book } from 'src/modules/book/book.entity';
import { User } from 'src/modules/user/user.entity';
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';

export enum Status {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

@Entity()
export class BookUser {
  @PrimaryColumn({ length: 13 })
  isbn: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'isbn' })
  book: Book;

  @Column({ type: 'enum', enum: Status, default: Status.UNREAD })
  status: Status;
}
