import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
