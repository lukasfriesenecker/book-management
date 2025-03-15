import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('api/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':isbn')
  async findOne(@Param('isbn') isbn: string) {
    return this.bookService.findOne(isbn);
  }

  @Put(':isbn')
  async update(
    @Param('isbn') isbn: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(isbn, updateBookDto);
  }

  @Delete(':isbn')
  async delete(@Param('isbn') isbn: string) {
    return this.bookService.delete(isbn);
  }
}
