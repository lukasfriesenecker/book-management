import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const book = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(book);
  }

  async find(isbn: string): Promise<Review[] | null> {
    return this.reviewRepository.find({ where: { isbn: isbn } });
  }

  async update(
    isbn: string,
    userId: number,
    updateReveiewDto: UpdateReviewDto,
  ): Promise<Review | null> {
    const review = await this.reviewRepository.findOne({
      where: { isbn: isbn, userId: userId },
    });

    if (!review) {
      throw new Error(
        `Review with ISBN ${isbn} not found for user with ID ${userId}.`,
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

  async delete(isbn: string, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { isbn: isbn, userId: userId },
    });

    if (!review) {
      throw new HttpException(
        `Review with ISBN ${isbn} not found for user with ID ${userId}.`,
        404,
      );
    }

    await this.reviewRepository.delete({ isbn: isbn, userId: userId });
  }
}
