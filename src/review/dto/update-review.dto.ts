import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({ example: 5, required: false })
  rating?: number;

  @ApiProperty({ example: 'Loved it!', required: false })
  comment?: string;
}
