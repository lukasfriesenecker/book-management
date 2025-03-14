import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BookService {
  addBook(request: Request): string {
    console.log(request.body);
    // update database
    return 'Book added';
  }

  updateBook(request: Request): string {
    return 'Book updated';
  }

  deleteBook(request: Request): string {
    return 'Book deleted';
  }
}
