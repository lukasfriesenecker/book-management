import { Module } from '@nestjs/common';
import { Book } from './book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
