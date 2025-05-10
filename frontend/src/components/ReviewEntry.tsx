import { getInitials } from '@/utils/getInitials';
import { Avatar, AvatarFallback } from './ui/avatar';
import { getAvatarColor } from '@/utils/getAvatarColor';
import { StarIcon } from 'lucide-react';
import { Review } from '@/constants/Review';

export function ReviewEntry({ review }: { review: Review }) {
  return (
    <div key={`${review.isbn}-${review.userId}`} className="border-b pb-4">
      <div className="mb-2 flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarFallback className={getAvatarColor(0)}>
            {getInitials(review.username)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {review.username || `User ${review.userId}`}
          </p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`size-4 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {review.comment && <p className="text-gray-700">{review.comment}</p>}
    </div>
  );
}
