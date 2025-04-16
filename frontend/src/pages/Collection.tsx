import { useEffect, useState } from 'react';
import api from '../api';
import { Header } from '@/components/Header';
import { useUser } from '@/contexts/UserContext';
import { Book } from '@/constants/book';
import { CollectionBookCard } from '@/components/CollectionBookCard';
import { isInCollection } from '@/utils/isInCollection';

export default function Collection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useUser();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    }
  };

  useEffect(() => {
    const filterBooks = async () => {
      if (!user) {
        setFilteredBooks([]);
        return;
      }

      try {
        const filtered = await Promise.all(
          books.map(async (book) => {
            const matchesSearch =
              book.isbn.includes(searchQuery) ||
              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.author.toLowerCase().includes(searchQuery.toLowerCase());

            const inCollection = await isInCollection(book.isbn, user.id);

            return inCollection && matchesSearch ? book : null;
          }),
        );

        setFilteredBooks(filtered.filter((book) => book !== null) as Book[]);
      } catch (error) {
        console.error('Error filtering books:', error);
        setError('Failed to filter books. Please try again.');
      }
    };

    filterBooks();
  }, [books, searchQuery, user]);

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
              <CollectionBookCard
                key={book.isbn}
                book={book}
                onRemove={() => {
                  setBooks((prev) => prev.filter((b) => b.isbn !== book.isbn));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
