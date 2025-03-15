import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookUser } from './book-user.entity';
import { BookUserService } from './book-user.service';
import { BookUserController } from './book-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookUser])],
  providers: [BookUserService],
  controllers: [BookUserController],
})
export class BookUserModule {}
