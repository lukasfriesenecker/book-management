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
import { ApiResponse } from '@nestjs/swagger';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @RequiredRole(Role.ADMIN)
  @ApiResponse({
    status: 400,
    description: 'ISBN must be exactly 13 characters long',
  })
  @ApiResponse({
    status: 409,
    description: 'A book with this ISBN already exists',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
  })
  async findAll() {
    return this.bookService.findAll();
  }

  @Put(':isbn')
  @RequiredRole(Role.ADMIN)
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Updated',
  })
  async update(
    @Param('isbn') isbn: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(isbn, updateBookDto);
  }

  @Delete(':isbn')
  @RequiredRole(Role.ADMIN)
  @HttpCode(204)
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiResponse({
    status: 204,
    description: 'Deleted',
  })
  async delete(@Param('isbn') isbn: string) {
    return this.bookService.delete(isbn);
  }
}
