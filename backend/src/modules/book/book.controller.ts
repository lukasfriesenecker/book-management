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
import { RequiredRole } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/user/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 400,
    description: 'ISBN must be exactly 13 characters long',
  })
  @ApiResponse({
    status: 409,
    description: 'Book already exists',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
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

  @Get(':isbn')
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
  })
  async findOne(@Param('isbn') isbn: string) {
    return this.bookService.findOne(isbn);
  }

  @Put(':isbn')
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 200,
    description: 'Updated',
  })
  
  @RequiredRole(Role.ADMIN)
  async update(
    @Param('isbn') isbn: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(isbn, updateBookDto);
  }

  @Delete(':isbn')
  @HttpCode(204)
  @RequiredRole(Role.ADMIN)
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiResponse({
    status: 204,
    description: 'Deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async delete(@Param('isbn') isbn: string) {
    return this.bookService.delete(isbn);
  }
}
