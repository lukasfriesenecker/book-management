import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookUser } from './book-user.entity';
import { BookUserService } from './book-user.service';
import { BookUserController } from './book-user.controller';
import { BookModule } from 'src/modules/book/book.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookUser]), BookModule, UserModule],
  providers: [BookUserService],
  controllers: [BookUserController],
})
export class BookUserModule {}
