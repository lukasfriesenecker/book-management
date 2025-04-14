import { Navbar } from "@/components/Navbar"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookMarked } from "lucide-react"
import { toast } from "sonner"
import api from "../api"

interface Book {
  isbn: string
  title: string
  author: string
  year: string
}

interface BookUser {
  userId: number
  isbn: string
  status: "read" | "unread"
}

export default function MyCollection() {
  const userId = 1
  const [books, setBooks] = useState<Book[]>([])
  const [error, setError] = useState("")
  const [bookUsers, setBookUsers] = useState<BookUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await fetchBooks()
    await fetchBookUsers()
  }

  // Fetch Books from API
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books")
      if (response.status === 200) {
        setBooks(response.data)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setError("Failed to load books. Please try again.")
    }
  }

  // Fetch user's book collection
  const fetchBookUsers = async () => {
    try {
      const response = await api.get(`/books-users/${userId}`)
      if (response.status === 200) {
        setBookUsers(response.data)
      }
    } catch (error) {
      console.error("Error fetching user's books:", error)
      setError("Failed to load your collection. Please try again.")
    }
  }

  // Check if a book is in the user's collection
  const isInCollection = (isbn: string): boolean => {
    return bookUsers.some((bu) => bu.isbn === isbn)
  }

  // Get the read status of a book from bookUsers
  const getBookStatus = (isbn: string): "read" | "unread" => {
    const bookUser = bookUsers.find((bu) => bu.isbn === isbn)
    return bookUser ? bookUser.status.toLowerCase() as "read" | "unread" : "unread"
  }

  // Filter books based on search query and only show collection books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)

    return isInCollection(book.isbn) && matchesSearch
  })

  // Toggle read status
  const toggleReadStatus = async (isbn: string) => {
    setError("")

    const currentStatus = getBookStatus(isbn)
    const newStatus = currentStatus === "read" ? "unread" : "read"

    try {
      // Update the user-book relationship
      await api.put(`/books-users/${isbn}/${userId}`, {
        status: newStatus,
      })

      toast.success(`Book marked as ${newStatus}!`)

      // Update local state
      setBookUsers(bookUsers.map((bu) => (bu.isbn === isbn ? { ...bu, status: newStatus } : bu)))
    } catch (error) {
      console.error("Error updating read status:", error)
      toast.error("Failed to update read status. Please try again.")
    }
  }

  // Remove from collection
  const removeFromCollection = async (isbn: string) => {
    setError("")

    try {
      // Remove from collection
      await api.delete(`/books-users/${isbn}/${userId}`)
      toast.success("Book removed from your collection!")

      // Update local state by removing the book from bookUsers
      setBookUsers(bookUsers.filter((bu) => bu.isbn !== isbn))
    } catch (error) {
      console.error("Error removing from collection:", error)
      toast.error("Failed to remove book from collection. Please try again.")
    }
  }

  return (
    <div>
      <Navbar userId={userId} username="admin" />

      <div className="container mx-auto p-4 max-w-7xl">

        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">My Collection</h1>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collection..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

          </div>
        </header>



        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 border rounded-md">
            <p className="text-muted-foreground">
              No books in your collection. Add books to your collection from the All Books page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const status = getBookStatus(book.isbn)

              return (
                <Card key={book.isbn} className="relative border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge
                        variant={status === "read" ? "default" : "outline"}
                        className={status === "read" ? "bg-green-600" : ""}
                      >
                        {status === "read" ? "Read" : "Unread"}
                      </Badge>
                      <Badge variant="default" className="bg-indigo-600">
                        In Collection
                      </Badge>
                    </div>

                    <h2 className="text-xl font-bold mb-1 text-gray-800">{book.title}</h2>
                    <p className="text-gray-600 mb-2">{book.author}</p>

                    <div className="text-sm text-gray-500 mb-4">
                      <p>Published: {book.year}</p>
                      <p>ISBN: {book.isbn}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReadStatus(book.isbn)}
                        className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {status === "read" ? "Mark Unread" : "Mark as Read"}
                      </Button>
                    </div>

                    <Button
                      className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
                      size="sm"
                      onClick={() => removeFromCollection(book.isbn)}
                    >
                      <BookMarked className="h-4 w-4 mr-2" />
                      Remove from Collection
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
