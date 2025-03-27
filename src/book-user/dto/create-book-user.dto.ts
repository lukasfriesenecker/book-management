import { Status } from '../book-user.entity';

export class CreateBookUserDto {
  isbn: string;
  userId: number;
  status?: Status;
}
