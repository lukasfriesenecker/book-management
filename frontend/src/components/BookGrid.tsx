import { Badge } from '@/components/ui/badge';
import BookReviewDialog from '@/components/Bookreview';
import { Edit, Trash2, BookMarked } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from '@/constants/book';
import { BookUser } from '@/constants/book-user';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import api from '@/api';
import { useUser } from '@/contexts/UserContext';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onToggleCollection: (isbn: string, userId: number) => void;
  onDelete: (isbn: string) => void;
  onEdit: (book: Book) => void;
  userId: number;
}

export function BookGrid({
  books,
  onToggleCollection,
  onDelete,
  onEdit,
}: BookGridProps) {
  // Helper function to check if a book is in the collection
  const isInCollection = (isbn: string): boolean => {
    return bookUsers.some((bu) => bu.isbn === isbn);
  };

  const [bookUsers, setBookUsers] = useState<BookUser[]>([]);
  const { user } = useUser();

  useEffect(() => {
    fetchBookUsers();
  }, []);

  const fetchBookUsers = async () => {
    try {
      const response = await api.get(`/books-users/${user?.id}`);
      setBookUsers(response.data);
    } catch (error) {
      console.error("Error fetching user's books:", error);
      //setError('Failed to load your collection. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.isbn}
          book={book}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
