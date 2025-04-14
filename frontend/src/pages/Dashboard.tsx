"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BookMarked, CheckCircle2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/Navbar"
import { BookSpinner } from "@/components/Bookspinner"
import { useNavigate } from "react-router-dom"
import api from "../api"

interface Book {
  isbn: string
  title: string
  author: string
  year: string
}

interface BookUser {
  userId: number
  bookIsbn: string
  status: "read" | "unread"
}

interface Review {
  isbn: string
  userId: number
  rating: number
  comment: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const userId = 1
  const [books, setBooks] = useState<Book[]>([])
  const [bookUsers, setBookUsers] = useState<BookUser[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const start = Date.now()
      try {
        // Fetch all required data
        const [booksRes, bookUsersRes] = await Promise.all([api.get("/books"), api.get(`/books-users/${userId}`)])

        setBooks(booksRes.data)
        setBookUsers(bookUsersRes.data)

        // Fetch reviews for books in collection
        const reviewsPromises = bookUsersRes.data.map((bu: BookUser) => api.get(`/reviews/${bu.bookIsbn}`))
        const reviewsResults = await Promise.all(reviewsPromises)
        const allReviews = reviewsResults.flatMap((res) => res.data)
        setReviews(allReviews)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }finally {
        const elapsed = Date.now() - start
        const remaining = 1500 - elapsed
  
        // Ensure the spinner shows for at least 3 seconds
        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining)
        } else {
          setLoading(false)
        }
    }
    }

    fetchData()
  }, [userId])

  // Calculate statistics
  const totalBooks = books.length
  const booksInCollection = bookUsers.length
  const readBooks = bookUsers.filter((bu) => bu.status === "read").length
  const readPercentage = booksInCollection > 0 ? Math.round((readBooks / booksInCollection) * 100) : 0

  // Get top rated books
  const bookRatings = books.map((book) => {
    const bookReviews = reviews.filter((review) => review.isbn === book.isbn)
    const avgRating =
      bookReviews.length > 0 ? bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length : 0
    return {
      ...book,
      avgRating,
      reviewCount: bookReviews.length,
    }
  })

  const topRatedBooks = [...bookRatings]
    .filter((book) => book.reviewCount > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5)

    if (loading) {
        return (
          <div className="flex flex-col min-h-screen">
            <Navbar userId={userId} username="admin" />
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <BookSpinner className="mx-auto mb-4" />
                <p className="text-gray-500">Loading dashboard data...</p>
              </div>
            </div>
          </div>
        )
      }

  return (
    <div>
      <Navbar userId={userId} username="admin" />

      <div className="container mx-auto p-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500">Welcome back to your book management dashboard</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Books</p>
                <h3 className="text-2xl font-bold">{totalBooks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Books in Collection</p>
                <h3 className="text-2xl font-bold">{booksInCollection}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <BookMarked className="h-6 w-6 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Reading Progress */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-indigo-600" />
                Reading Progress
              </CardTitle>
              <CardDescription>Your collection reading status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Read Books</span>
                    <span className="text-sm font-medium">
                      {readBooks} of {booksInCollection}
                    </span>
                  </div>
                  <Progress value={readPercentage} className="h-2 bg-gray-200 bg-indigo-600" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-indigo-600">{readBooks}</div>
                    <div className="text-sm text-gray-500">Read</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-indigo-600">{booksInCollection - readBooks}</div>
                    <div className="text-sm text-gray-500">Unread</div>
                  </div>
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate(`/collection/${userId}`)}>
                  View Collection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Rated Books */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-indigo-600" />
                Top Rated Books
              </CardTitle>
              <CardDescription>Highest rated books in the library</CardDescription>
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
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(book.avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{book.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No rated books yet. Start rating books to see them here!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
