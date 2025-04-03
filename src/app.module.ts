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
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_NAME,
      entities: [Book, User, BookUser, Review],
      synchronize: true,
    }),
    UserModule,
    BookModule,
    BookUserModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
