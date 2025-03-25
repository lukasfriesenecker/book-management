import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookUser, Status } from './book-user.entity';

@Injectable()
export class BookUserService {
  constructor(
    @InjectRepository(BookUser)
    private bookUserRepository: Repository<BookUser>,
  ) {}

  async findAll(): Promise<BookUser[]> {
    return this.bookUserRepository.find();
  }

  async findAllPerUser(userId: number): Promise<BookUser[]> {
    return this.bookUserRepository.find({ where: { userId } });
  }

  async toggleStatus(isbn: string, userId: number): Promise<BookUser> {
    const bookUser = await this.bookUserRepository.findOne({
      where: { isbn, userId },
    });

    if (!bookUser) {
      throw new Error(
        `Book with ISBN ${isbn} not found for user with ID ${userId}.`,
      );
    }

    bookUser.status =
      bookUser.status === Status.UNREAD ? Status.READ : Status.UNREAD;

    return this.bookUserRepository.save(bookUser);
  }
}
