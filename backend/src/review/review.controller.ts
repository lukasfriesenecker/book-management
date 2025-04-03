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
import { ApiResponse } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 404,
    description: 'Book or User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Review already exists',
  })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get(':isbn')
  @ApiResponse({
    status: 200,
    description: 'Data retrieved successfully',
  })
  async findAllPerBook(@Param('isbn') isbn: string) {
    return this.reviewService.findAllPerBook(isbn);
  }

  @Put(':isbn/:userId')
  @ApiResponse({
    status: 200,
    description: 'Updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  async update(
    @Param('isbn') isbn: string,
    @Param('userId') userId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(isbn, userId, updateReviewDto);
  }

  @Delete(':isbn/:userId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  async delete(@Param('isbn') isbn: string, @Param('userId') userId: number) {
    return this.reviewService.delete(isbn, userId);
  }
}
