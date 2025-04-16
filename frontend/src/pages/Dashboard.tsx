import { useState, useEffect } from 'react';
import { BookOpen, BookMarked } from 'lucide-react';
import { BookSpinner } from '@/components/Bookspinner';
import api from '../api';
import { Book } from '@/constants/book';
import { BookUser } from '@/constants/book-user';
import { Review } from '@/constants/Review';
import { useUser } from '@/contexts/UserContext';
import { TopRatedCard } from '@/components/TopRatedCard';
import { BookCountCard } from '@/components/BookCountCard';
import { Status } from '@/constants/status';
import { ProgressCard } from '@/components/ProgressCard';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [books, setBooks] = useState<Book[]>([]);
  const [bookUsers, setBookUsers] = useState<BookUser[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      const start = Date.now();

      try {
        const booksRes = await api.get('/books');
        setBooks(booksRes.data);

        const bookUsersRes = await api.get(`/books-users/${user.id}`);
        setBookUsers(bookUsersRes.data);

        const reviewsRes = (
          await Promise.all(
            booksRes.data.map((book: Book) => api.get(`/reviews/${book.isbn}`)),
          )
        ).flatMap((res) => res.data);
        setReviews(reviewsRes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 1500 - elapsed;

        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      }
    })();
  }, [user]);

  const readBooks = bookUsers.filter((bu) => bu.status === Status.READ).length;
  const readPercentage =
    bookUsers.length > 0 ? Math.round((readBooks / bookUsers.length) * 100) : 0;

  const bookRatings = books.map((book) => {
    const bookReviews = reviews.filter((review) => review.isbn === book.isbn);
    const avgRating =
      bookReviews.length > 0
        ? bookReviews.reduce((sum, review) => sum + review.rating, 0) /
          bookReviews.length
        : 0;
    return {
      ...book,
      avgRating,
      reviewCount: bookReviews.length,
    };
  });

  const topRatedBooks = [...bookRatings]
    .filter((book) => book.reviewCount > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-grow items-center justify-center">
          <div className="text-center">
            <BookSpinner className="mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto max-w-7xl p-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back to your book management dashboard
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <BookCountCard
            text="Total Books"
            count={books.length}
            icon={<BookOpen />}
          />

          <BookCountCard
            text="Books in Collection"
            count={bookUsers.length}
            icon={<BookMarked />}
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ProgressCard
            totalBooks={bookUsers.length}
            readBooks={readBooks}
            readPercentage={readPercentage}
          />

          <TopRatedCard topRatedBooks={topRatedBooks} />
        </div>
      </div>
    </div>
  );
}
