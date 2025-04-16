import { Badge } from '@/components/ui/badge';
import BookReviewDialog from '@/components/Bookreview';
import { Edit, Trash2, BookMarked } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from '@/constants/book';
import { BookUser } from '@/constants/book-user';
import { Button } from './ui/button';

interface BookGridProps {
  books: Book[];
  bookUsers: BookUser[];
  onToggleCollection: (isbn: string) => void;
  onDelete: (isbn: string) => void;
  onEdit: (book: Book) => void;
  userId: number;
}

export function BookGrid({
  books,
  bookUsers,
  onToggleCollection,
  onDelete,
  onEdit,
}: BookGridProps) {
  // Helper function to check if a book is in the collection
  const isInCollection = (isbn: string): boolean => {
    return bookUsers.some((bu) => bu.isbn === isbn);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => {
        const inCollection = isInCollection(book.isbn);

        return (
          <Card
            key={book.isbn}
            className="relative border-gray-200 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="pt-6">
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge
                  variant={inCollection ? 'default' : 'outline'}
                  className={inCollection ? 'bg-indigo-600' : ''}
                >
                  {inCollection ? 'In Collection' : 'Not Collected'}
                </Badge>
              </div>

              <h2 className="mb-1 text-xl font-bold text-gray-800">
                {book.title}
              </h2>
              <p className="mb-2 text-gray-600">{book.author}</p>

              <div className="mb-4 text-sm text-gray-500">
                <p className="mb-1">Published: {book.year}</p>
                <div className="flex items-center justify-between">
                  <p className="m-0">ISBN: {book.isbn}</p>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(book)}
                      className="rounded-r-none border-r-0 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(book.isbn)}
                      className="rounded-l-none border-gray-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                className={`mt-3 w-full ${
                  inCollection
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                size="sm"
                onClick={() => onToggleCollection(book.isbn)}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                {inCollection ? 'Uncollect' : 'Collect'}
              </Button>
              <BookReviewDialog book={book} userId={1} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
