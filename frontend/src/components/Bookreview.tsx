import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"
import { toast } from "sonner"
import api from "../api"

interface Book {
  isbn: string
  title: string
  author: string
  year: string
}

interface Review {
  isbn: string
  userId: number
  rating: number
  comment: string
}

interface BookReviewDialogProps {
  book: Book
  userId: number
}

export default function BookReviewDialog({ book, userId }: BookReviewDialogProps) {
  const [reviews, setReviews] = useState<any[]>([
    {
      isbn: "9780553593716",
      userId: 1,
      rating: 5,
      comment: "Great book!"
    },
    {
      isbn: "9780553593716",
      userId: 8,
      rating: 2,
      comment: "Great book1!"
    },
    {
      isbn: "9780553593716",
      userId: 9,
      rating: 3,
      comment: "Great book2!"
    },
  ])
  const [loading, setLoading] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Fetch reviews when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchReviews()
    }
  }, [isOpen, book.isbn])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/reviews/${book.isbn}`)
      if (response.status === 200) {
        // Get the reviews
        const reviewsData = response.data

        // For each review, fetch the user data
        const reviewsWithUsers = await Promise.all(
          reviewsData.map(async (review: Review) => {
            const userResponse = await api.get(`/users/${review.userId}`)
            return {
              ...review,
              user: userResponse.data,
            }
          }),
        )

        setReviews(reviewsWithUsers)

        // Check if the current user has already reviewed this book
        const existingReview = reviewsData.find((review: Review) => review.userId === userId)
        if (existingReview) {
          setUserReview(existingReview)
          setNewRating(existingReview.rating)
          setNewComment(existingReview.comment || "")
        } else {
          setUserReview(null)
          setNewRating(0)
          setNewComment("")
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      toast.error("Please select a rating")
      return
    }

    setIsSubmitting(true)
    try {
      const reviewData = {
        isbn: book.isbn,
        userId,
        rating: newRating,
        comment: newComment.trim() || null,
      }

      if (userReview) {
        // Update existing review
        await api.put(`/reviews/${book.isbn}/${userId}`, reviewData)
        toast.success("Review updated successfully")
      } else {
        // Create new review
        await api.post("/reviews", reviewData)
        toast.success("Review submitted successfully")
      }

      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!userReview) return

    try {
      await api.delete(`/reviews/${book.isbn}/${userId}`)
      toast.success("Review deleted successfully")

      // Refresh reviews
      fetchReviews()
      setUserReview(null)
      setNewRating(0)
      setNewComment("")
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Failed to delete review")
    }
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return "0.0"
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          onClick={() => setIsOpen(true)}
        >
          Reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reviews for {book.title}</DialogTitle>
          <DialogDescription>
            By {book.author} • Published {book.year}
          </DialogDescription>
        </DialogHeader>

        {/* Average Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${star <= Math.round(Number.parseFloat(calculateAverageRating()))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                  }`}
              />
            ))}
          </div>
          <span className="font-bold">{calculateAverageRating()}</span>
          <span className="text-gray-500">
            ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        </div>

        {/* User's Review Form */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium mb-2">{userReview ? "Your Review" : "Write a Review"}</h3>

          <div className="flex mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-6 w-6 cursor-pointer ${star <= newRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                onClick={() => setNewRating(star)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Share your thoughts about this book (optional)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3"
          />

          <div className="flex justify-end gap-2">
            {userReview && (
              <Button variant="outline" onClick={handleDeleteReview} className="text-red-600 hover:text-red-700">
                Delete
              </Button>
            )}
            <Button onClick={handleSubmitReview} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review this book!</div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">All Reviews</h3>
            {reviews
              .filter((review) => review.userId !== userId) // Filter out the current user's review
              .map((review) => (
                <div key={`${review.isbn}-${review.userId}`} className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.user?.avatarUrl || "/placeholder.svg"}
                        alt={review.user?.username || "User"}
                      />
                      <AvatarFallback>{review.user?.username?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user?.username || `User ${review.userId}`}</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </div>
              ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
