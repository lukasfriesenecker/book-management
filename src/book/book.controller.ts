import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { RequiredRole } from 'src/decorators/roles.decorator';
import { Role } from 'src/user/user.entity';

@Controller('api/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @RequiredRole(Role.ADMIN)
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Put(':isbn')
  async update(
    @Param('isbn') isbn: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(isbn, updateBookDto);
  }

  @Delete(':isbn')
  @HttpCode(204)
  async delete(@Param('isbn') isbn: string) {
    return this.bookService.delete(isbn);
  }
}
