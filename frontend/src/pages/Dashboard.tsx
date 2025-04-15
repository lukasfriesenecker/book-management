'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, BookMarked, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/Navbar';
import { BookSpinner } from '@/components/Bookspinner';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface Book {
  isbn: string;
  title: string;
  author: string;
  year: string;
}

interface BookUser {
  userId: number;
  isbn: string;
  status: 'READ' | 'UNREAD';
}

interface Review {
  isbn: string;
  userId: number;
  rating: number;
  comment: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = 1;
  const [books, setBooks] = useState<Book[]>([]);
  const [bookUsers, setBookUsers] = useState<BookUser[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const start = Date.now();
      try {
        // Fetch all required data
        const [booksRes, bookUsersRes] = await Promise.all([
          api.get('/books'),
          api.get(`/books-users/${userId}`),
        ]);

        setBooks(booksRes.data);
        setBookUsers(bookUsersRes.data);

        // Fetch reviews for books in collection
        const reviewsPromises = bookUsersRes.data.map((bu: BookUser) =>
          api.get(`/reviews/${bu.isbn}`),
        );
        const reviewsResults = await Promise.all(reviewsPromises);
        const allReviews = reviewsResults.flatMap((res) => res.data);
        setReviews(allReviews);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 1500 - elapsed;

        // Ensure the spinner shows for at least 3 seconds
        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [userId]);

  // Calculate statistics
  const totalBooks = books.length;
  const booksInCollection = bookUsers.length;
  const readBooks = bookUsers.filter((bu) => bu.status === 'READ').length;
  const readPercentage =
    booksInCollection > 0
      ? Math.round((readBooks / booksInCollection) * 100)
      : 0;

  // Get top rated books
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
        {/*<Navbar userId={userId} username="admin" />*/}
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
      {/*<Navbar userId={userId} username="admin" />*/}

      <div className="container mx-auto max-w-7xl p-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back to your book management dashboard
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Books</p>
                <h3 className="text-2xl font-bold">{totalBooks}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Books in Collection
                </p>
                <h3 className="text-2xl font-bold">{booksInCollection}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <BookMarked className="h-6 w-6 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Reading Progress */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-indigo-600" />
                Reading Progress
              </CardTitle>
              <CardDescription>Your collection reading status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium">Read Books</span>
                    <span className="text-sm font-medium">
                      {readBooks} of {booksInCollection}
                    </span>
                  </div>
                  <Progress
                    value={readPercentage}
                    className="h-2 bg-gray-200 bg-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="text-3xl font-bold text-indigo-600">
                      {readBooks}
                    </div>
                    <div className="text-sm text-gray-500">Read</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="text-3xl font-bold text-indigo-600">
                      {booksInCollection - readBooks}
                    </div>
                    <div className="text-sm text-gray-500">Unread</div>
                  </div>
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => navigate(`/collection/${userId}`)}
                >
                  View Collection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Rated Books */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-indigo-600" />
                Top Rated Books
              </CardTitle>
              <CardDescription>
                Highest rated books in the library
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topRatedBooks.length > 0 ? (
                <div className="space-y-4">
                  {topRatedBooks.map((book) => (
                    <div
                      key={book.isbn}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-500">
                          {book.author}, {book.year}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(book.avgRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {book.avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No rated books yet. Start rating books to see them here!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
