import { Book } from 'src/modules/book/book.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryColumn({ length: 13 })
  isbn: string;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'isbn' })
  book: Book;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment: string;
}
