import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookUser, Status } from './book-user.entity';
import { UserService } from 'src/modules/user/user.service';
import { BookService } from 'src/modules/book/book.service';

@Injectable()
export class BookUserService {
  constructor(
    @InjectRepository(BookUser)
    private bookUserRepository: Repository<BookUser>,
    private bookService: BookService,
    private userService: UserService,
  ) {}

  async create(isbn: string, userId: string): Promise<BookUser> {
    await this.bookService.exists(isbn);
    await this.userService.exists(userId);

    const bookUser = await this.bookUserRepository.findOne({
      where: { isbn: isbn, userId: userId },
    });

    if (bookUser) {
      throw new HttpException(
        `BookUser with ISBN ${isbn} and USERID ${userId} already exists`,
        409,
      );
    }

    return this.bookUserRepository.save({
      isbn: isbn,
      userId: userId,
    });
  }

  async findAllPerUser(userId: string): Promise<BookUser[]> {
    return this.bookUserRepository.find({ where: { userId } });
  }

  async toggleStatus(isbn: string, userId: string): Promise<BookUser | null> {
    const bookUser = await this.bookUserRepository.findOne({
      where: { isbn, userId },
    });

    if (!bookUser) {
      throw new HttpException(
        `BookUser with ISBN ${isbn} and USERID ${userId} not found`,
        404,
      );
    }

    const updatedStatus =
      bookUser.status === Status.UNREAD ? Status.READ : Status.UNREAD;

    await this.bookUserRepository.update(
      { isbn: isbn, userId: userId },
      { status: updatedStatus },
    );

    return this.bookUserRepository.findOne({
      where: { isbn: isbn, userId: userId },
    });
  }

  async delete(isbn: string, userId: string): Promise<void> {
    const bookUser = await this.bookUserRepository.findOne({
      where: { isbn, userId },
    });

    if (!bookUser) {
      throw new HttpException(
        `BookUser with ISBN ${isbn} and USERID ${userId} not found`,
        404,
      );
    }

    await this.bookUserRepository.delete({ isbn: isbn, userId: userId });
  }
}
