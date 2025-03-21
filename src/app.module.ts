import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { Book } from './book/book.entity';
import { ConfigModule } from '@nestjs/config';
import { BookUser } from './book-user/book-user.entity';
import { BookUserModule } from './book-user/book-user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Book, User, BookUser],
      synchronize: true,
    }),
    UserModule,
    BookModule,
    BookUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
