import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookUser, Status } from './book-user.entity';
import { CreateBookUserDto } from './dto/create-book-user.dto';

@Injectable()
export class BookUserService {
  constructor(
    @InjectRepository(BookUser)
    private bookUserRepository: Repository<BookUser>,
  ) {}

  async create(createBookUserDto: CreateBookUserDto): Promise<BookUser> {
    return this.bookUserRepository.save(createBookUserDto);
  }

  async findAllPerUser(userId: number): Promise<BookUser[]> {
    return this.bookUserRepository.find({ where: { userId } });
  }

  async toggleStatus(isbn: string, userId: number): Promise<BookUser | null> {
    const bookUser = await this.bookUserRepository.findOne({
      where: { isbn, userId },
    });

    if (!bookUser) {
      throw new HttpException(
        `Book with ISBN ${isbn} not found for user with ID ${userId}.`,
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

  async delete(isbn: string, userId: number): Promise<void> {
    const bookUser = await this.bookUserRepository.findOne({
      where: { isbn, userId },
    });

    if (!bookUser) {
      throw new HttpException(
        `Book with ISBN ${isbn} not found for user with ID ${userId}.`,
        404,
      );
    }

    await this.bookUserRepository.delete({ isbn, userId });
  }
}
