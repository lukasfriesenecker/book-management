import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../api';
import { Header } from '@/components/Header';
import { useUser } from '@/contexts/UserContext';
import { BookCard } from '@/components/BookCard';
import { Book } from '@/constants/book';
import { BookCardCollection } from '@/components/BookCardCollection';

interface BookUser {
  userId: number;
  isbn: string;
  status: 'read' | 'unread';
}

export default function MyCollection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [bookUsers, setBookUsers] = useState<BookUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useUser();

  useEffect(() => {
    fetchBooks();
    fetchBookUsers();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      if (response.status === 200) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    }
  };

  const fetchBookUsers = async () => {
    try {
      const response = await api.get(`/books-users/${user?.id}`);
      if (response.status === 200) {
        setBookUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching user's books:", error);
      setError('Failed to load your collection. Please try again.');
    }
  };

  const isInCollection = (isbn: string): boolean => {
    return bookUsers.some((bu) => bu.isbn === isbn);
  };

  const getBookStatus = (isbn: string): 'read' | 'unread' => {
    const bookUser = bookUsers.find((bu) => bu.isbn === isbn);
    return bookUser
      ? (bookUser.status.toLowerCase() as 'read' | 'unread')
      : 'unread';
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);

    return isInCollection(book.isbn) && matchesSearch;
  });

  return (
    <div>
      <div className="container mx-auto max-w-7xl p-4">
        <Header
          headline="My Collection"
          searchText="Search collection..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {filteredBooks.length === 0 ? (
          <div className="rounded-md border py-12 text-center">
            <p className="text-muted-foreground">
              No books in your collection. Add books to your collection from the
              All Books page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCardCollection
                key={book.isbn}
                book={book}
                onRemove={() => {
                  setBookUsers((prev) =>
                    prev.filter((bu) => bu.isbn !== book.isbn),
                  );
                }}
              />
            ))}
          </div>

          /*<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => {
              const status = getBookStatus(book.isbn);

              return (
                <Card
                  key={book.isbn}
                  className="relative border-gray-200 shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="pt-6">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge
                        variant={status === 'read' ? 'default' : 'outline'}
                        className={status === 'read' ? 'bg-green-600' : ''}
                      >
                        {status === 'read' ? 'Read' : 'Unread'}
                      </Badge>
                      <Badge variant="default" className="bg-indigo-600">
                        In Collection
                      </Badge>
                    </div>

                    <h2 className="mb-1 text-xl font-bold text-gray-800">
                      {book.title}
                    </h2>
                    <p className="mb-2 text-gray-600">{book.author}</p>

                    <div className="mb-4 text-sm text-gray-500">
                      <p>Published: {book.year}</p>
                      <p>ISBN: {book.isbn}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleReadStatus(book.isbn, user?.id || -1)
                        }
                        className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {status === 'read' ? 'Mark Unread' : 'Mark as Read'}
                      </Button>
                    </div>

                    <Button
                      className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700"
                      size="sm"
                      onClick={() => removeFromCollection(book.isbn)}
                    >
                      <BookMarked className="mr-2 h-4 w-4" />
                      Remove from Collection
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>*/
        )}
      </div>
    </div>
  );
}
