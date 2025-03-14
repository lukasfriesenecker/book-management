import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Request } from 'express';
import { Book } from './book.entity';

@Controller('api/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('add')
  addBook(@Req() request: Request): Promise<Book[]> {
    return this.bookService.addBook(request);
  }

  @Put('update:isbn')
  updateBook(@Req() request: Request): string {
    return this.bookService.updateBook(request);
  }

  @Delete('delete:isbn')
  deleteBook(@Req() request: Request): string {
    return this.bookService.deleteBook(request);
  }
}
