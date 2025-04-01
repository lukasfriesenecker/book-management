import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get(':isbn')
  async find(@Param('isbn') isbn: string) {
    return this.reviewService.find(isbn);
  }

  @Put(':isbn/:userId')
  async update(
    @Param('isbn') isbn: string,
    @Param('userId') userId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(isbn, userId, updateReviewDto);
  }

  @Delete(':isbn/:userId')
  @HttpCode(204)
  async delete(@Param('isbn') isbn: string, @Param('userId') userId: number) {
    return this.reviewService.delete(isbn, userId);
  }
}
