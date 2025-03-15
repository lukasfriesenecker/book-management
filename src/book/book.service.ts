import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(isbn: string): Promise<Book | null> {
    return this.bookRepository.findOne({ where: { isbn } });
  }

  async update(
    isbn: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book | null> {
    await this.bookRepository.update(isbn, updateBookDto);
    return this.findOne(isbn);
  }

  async delete(isbn: string): Promise<void> {
    await this.bookRepository.delete(isbn);
  }
}
