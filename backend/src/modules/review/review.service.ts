import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { BookService } from 'src/modules/book/book.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private bookService: BookService,
    private userService: UserService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    await this.bookService.exists(createReviewDto.isbn);
    await this.userService.exists(createReviewDto.userId);

    const review = await this.reviewRepository.findOne({
      where: { isbn: createReviewDto.isbn, userId: createReviewDto.userId },
    });

    if (review) {
      throw new HttpException(
        `Review with ISBN ${createReviewDto.isbn} and USERID ${createReviewDto.userId} already exists.`,
        409,
      );
    }

    return this.reviewRepository.save(createReviewDto);
  }

  async findAllPerBook(isbn: string): Promise<Review[] | null> {
    return this.reviewRepository.find({ where: { isbn: isbn } });
  }

  async update(
    isbn: string,
    userId: string,
    updateReveiewDto: UpdateReviewDto,
  ): Promise<Review | null> {
    const review = await this.reviewRepository.findOne({
      where: { isbn: isbn, userId: userId },
    });

    if (!review) {
      throw new HttpException(
        `Review with ISBN ${isbn} and USERID ${userId} not found`,
        409,
      );
    }

    await this.reviewRepository.update(
      { isbn: isbn, userId: userId },
      updateReveiewDto,
    );

    return this.reviewRepository.findOne({
      where: { isbn: isbn, userId: userId },
    });
  }

  async delete(isbn: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { isbn: isbn, userId: userId },
    });

    if (!review) {
      throw new HttpException(
        `Review with ISBN ${isbn} and USERID ${userId} not found`,
        404,
      );
    }

    await this.reviewRepository.delete({ isbn: isbn, userId: userId });
  }
}
