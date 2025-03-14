import { Module } from '@nestjs/common';
import { Book } from './book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  // Test
})
export class BookModule {}
