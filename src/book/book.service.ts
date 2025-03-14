import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  addBook(request: Request): Promise<Book[]> {
    console.log(request.body);
    const book = this.bookRepository.create(request.body);

    return this.bookRepository.save(book);
  }

  updateBook(request: Request): string {
    return 'Book updated';
  }

  deleteBook(request: Request): string {
    return 'Book deleted';
  }
}
