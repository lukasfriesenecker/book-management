import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import { Book } from '@/constants/book';
import { useUser } from '@/contexts/UserContext';
import { ReviewEntry } from './ReviewEntry';
import { Review } from '@/constants/Review';

export default function ReviewDialog({ book }: { book: Book }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentReview, setcurrentReview] = useState<Review | null>(null);
  const [isDialogOpen, setisDialogOpen] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (isDialogOpen) {
      fetchReviews();
    }
  }, [isDialogOpen, book.isbn]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${book.isbn}`);
      const reviewsData = response.data;

      const reviewsWithUsers = await Promise.all(
        reviewsData.map(async (review: Review) => {
          try {
            const userResponse = await api.get(`/users/${review.userId}`);
            return {
              ...review,
              username: userResponse.data.username,
            };
          } catch {
            return review;
          }
        }),
      );

      setReviews(reviewsWithUsers);

      const existingReview = reviewsWithUsers.find(
        (review) => review.userId === user?.id,
      );
      setcurrentReview(existingReview || null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) return;

    if (!currentReview?.rating) {
      toast.error('Please select a rating.');
      return;
    }

    try {
      const reviewData = {
        isbn: book.isbn,
        userId: user.id,
        rating: currentReview.rating,
        comment: currentReview.comment || '',
      };

      const existingReview = reviews.find(
        (review) => review.userId === user.id,
      );

      if (existingReview) {
        await api.put(`/reviews/${book.isbn}/${user.id}`, reviewData);
        toast.success('Review updated successfully.');
      } else {
        await api.post('/reviews', reviewData);
        toast.success('Review submitted successfully.');
      }

      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async () => {
    if (!user || !currentReview) return;

    try {
      await api.delete(`/reviews/${book.isbn}/${user.id}`);
      toast.success('Review deleted successfully.');
      setcurrentReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="mt-2 w-full text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reviews for {book.title}</DialogTitle>
          <DialogDescription>
            By {book.author} • Published {book.year}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(Number(calculateAverageRating()))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-bold">{calculateAverageRating()}</span>
          <span className="text-gray-500">
            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <div className="mb-6 rounded-md bg-gray-50 p-4">
          <h3 className="mb-2 font-medium">
            {currentReview ? 'Your Review' : 'Write a Review'}
          </h3>

          <div className="mb-3 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  star <= (currentReview?.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
                onClick={() =>
                  setcurrentReview((prev) =>
                    prev
                      ? { ...prev, rating: star }
                      : {
                          isbn: book.isbn,
                          userId: user?.id || 0,
                          rating: star,
                          comment: '',
                          username: user?.username || '',
                        },
                  )
                }
              />
            ))}
          </div>

          <Textarea
            placeholder="Share your thoughts about this book (optional)"
            value={currentReview?.comment || ''}
            onChange={(e) =>
              setcurrentReview((prev) =>
                prev
                  ? { ...prev, comment: e.target.value }
                  : {
                      isbn: book.isbn,
                      userId: user?.id || 0,
                      rating: 0,
                      comment: e.target.value,
                      username: user?.username || '',
                    },
              )
            }
            className="mb-3"
          />

          <div className="flex justify-end gap-2">
            {currentReview && (
              <Button
                variant="outline"
                onClick={handleDeleteReview}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            )}
            <Button
              onClick={handleSubmitReview}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {currentReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No reviews yet. Be the first to review this book!
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">All Reviews</h3>
            {reviews
              .filter((review) => review.userId !== user?.id)
              .map((review) => (
                <ReviewEntry
                  key={`${review.isbn}-${review.userId}`}
                  review={review}
                />
              ))}
          </div>
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
