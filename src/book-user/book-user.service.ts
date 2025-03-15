import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookUser } from './book-user.entity';

@Injectable()
export class BookUserService {
  constructor(
    @InjectRepository(BookUser)
    private bookUserRepository: Repository<BookUser>,
  ) {}
}
