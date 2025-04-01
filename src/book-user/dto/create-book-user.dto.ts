import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../book-user.entity';

export class CreateBookUserDto {
  @ApiProperty({ example: '9780132350884' })
  isbn: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: Status.READ })
  status?: Status;
}
