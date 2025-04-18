import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { BookModule } from 'src/modules/book/book.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), BookModule, UserModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
