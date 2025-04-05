import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({ example: 'The Pragmatic Programmer', required: false })
  title?: string;

  @ApiProperty({ example: '9780201616224', required: false })
  author?: string;

  @ApiProperty({ example: 1999, required: false })
  year?: number;
}
