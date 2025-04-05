import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '9780132350884' })
  isbn: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({ example: 'Great book!', required: false })
  comment?: string;
}
