import { Book } from 'src/book/book.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryColumn({ length: 13 })
  isbn: string;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'isbn' })
  book: Book;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment: string;
}
