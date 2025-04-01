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

@Controller('books-users')
export class BookUserController {
  constructor(private readonly bookUserService: BookUserService) {}

  @Post(':isbn/:userId')
  async create(@Param('isbn') isbn: string, @Param('userId') userId: number) {
    return this.bookUserService.create({ isbn: isbn, userId: userId });
  }

  @Get(':userId')
  async findAllPerUser(@Param('userId') userId: number) {
    return this.bookUserService.findAllPerUser(userId);
  }

  @Put(':isbn/:userId')
  async toggleStatus(
    @Param('isbn') isbn: string,
    @Param('userId') userId: number,
  ) {
    return this.bookUserService.toggleStatus(isbn, userId);
  }

  @Delete(':isbn/:userId')
  @HttpCode(204)
  async delete(@Param('isbn') isbn: string, @Param('userId') userId: number) {
    return this.bookUserService.delete(isbn, userId);
  }
}
