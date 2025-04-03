import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryColumn({ length: 13 })
  isbn: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'int' })
  year: number;
}
