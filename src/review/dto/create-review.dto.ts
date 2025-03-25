export class CreateReviewDto {
  isbn: string;
  userId: number;
  rating: number;
  comment?: string;
}
