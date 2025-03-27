import { HttpException, Injectable } from '@nestjs/common';
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
    const book = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (book) {
      throw new HttpException(
        `A book with ISBN ${createBookDto.isbn} already exists.`,
        409,
      );
    }

    return this.bookRepository.save(createBookDto);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async update(
    isbn: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book | null> {
    const book = await this.bookRepository.findOne({ where: { isbn: isbn } });

    if (!book) {
      throw new HttpException(`Book with ISBN ${isbn} not found.`, 404);
    }

    await this.bookRepository.update(isbn, updateBookDto);

    return this.bookRepository.findOne({ where: { isbn: isbn } });
  }

  async delete(isbn: string): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { isbn: isbn } });

    if (!book) {
      throw new HttpException(`Book with ISBN ${isbn} not found.`, 404);
    }

    await this.bookRepository.delete(isbn);
  }
}
