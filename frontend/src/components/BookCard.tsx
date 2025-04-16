import { BookMarked, Edit, Trash2 } from 'lucide-react';
import BookReviewDialog from './Bookreview';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Book } from '@/constants/book';
import { toggleCollection } from '@/utils/toggleCollection';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { isInCollection } from '@/utils/isInCollection';

interface BookCardProps {
  book: Book;
  handleDelete: (isbn: string) => void;
  handleEdit: (book: Book) => void;
}

export function BookCard({ book, handleDelete, handleEdit }: BookCardProps) {
  const [inCollection, setInCollection] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchCollectionStatus = async () => {
      setInCollection(await isInCollection(book.isbn, user?.id));
    };
    fetchCollectionStatus();
  }, [book.isbn, user]);

  const handleCollect = async () => {
    if (!user) return;

    const success = await toggleCollection(book.isbn, user.id);
    if (success) {
      setInCollection((prev) => !prev);
    }
  };

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

        <h2 className="mb-1 text-xl font-bold text-gray-800">{book.title}</h2>
        <p className="mb-2 text-gray-600">{book.author}</p>

        <div className="mb-4 text-sm text-gray-500">
          <p className="mb-1">Published: {book.year}</p>
          <div className="flex items-center justify-between">
            <p className="m-0">ISBN: {book.isbn}</p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(book)}
                className="rounded-r-none border-r-0 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(book.isbn)}
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
          onClick={handleCollect}
        >
          <BookMarked className="mr-2 h-4 w-4" />
          {inCollection ? 'Uncollect' : 'Collect'}
        </Button>
        <BookReviewDialog book={book} userId={1} />
      </CardContent>
    </Card>
  );
}
