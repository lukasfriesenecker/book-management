import { Controller, Get, Param, Put } from '@nestjs/common';
import { BookUserService } from './book-user.service';

@Controller('api/book-user')
export class BookUserController {
  constructor(private readonly bookUserService: BookUserService) {}

  @Get()
  async findAll() {
    return this.bookUserService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: number) {
    return this.bookUserService.findAllPerUser(userId);
  }

  @Put(':isbn/:userId')
  async toggleStatus(
    @Param('isbn') isbn: string,
    @Param('userId') userId: number,
  ) {
    return this.bookUserService.toggleStatus(isbn, userId);
  }
}
