import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookUserService } from './book-user.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('books-users')
export class BookUserController {
  constructor(private readonly bookUserService: BookUserService) {}

  @Post(':isbn/:userId')
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 404,
    description: 'Book or User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'BookUser already exists',
  })
  async create(@Param('isbn') isbn: string, @Param('userId') userId: string) {
    return this.bookUserService.create(isbn, userId);
  }

  @Get(':userId')
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
  })
  async findAllPerUser(@Param('userId') userId: string) {
    return this.bookUserService.findAllPerUser(userId);
  }

  @Put(':isbn/:userId')
  @ApiResponse({
    status: 200,
    description: 'Updated',
  })
  @ApiResponse({
    status: 404,
    description: 'BookUser not found',
  })
  async toggleStatus(
    @Param('isbn') isbn: string,
    @Param('userId') userId: string,
  ) {
    return this.bookUserService.toggleStatus(isbn, userId);
  }

  @Delete(':isbn/:userId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'BookUser not found',
  })
  async delete(@Param('isbn') isbn: string, @Param('userId') userId: string) {
    return this.bookUserService.delete(isbn, userId);
  }
}
