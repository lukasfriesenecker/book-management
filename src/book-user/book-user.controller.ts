import { Controller, Get, Param } from '@nestjs/common';
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
}
