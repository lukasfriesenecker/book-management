import { BookMarked } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Book } from '@/constants/book';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { isInCollection } from '@/utils/isInCollection';
import { toast } from 'sonner';
import api from '@/api';
import { Status } from '@/constants/status';
import { getStatus } from '@/utils/getStatus';

interface CollectionBookCardProps {
  book: Book;
  onRemove: () => void;
}

export function CollectionBookCard({
  book,
  onRemove,
}: CollectionBookCardProps) {
  const [inCollection, setInCollection] = useState(false);
  const [status, setStatus] = useState<Status>();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setStatus(await getStatus(book.isbn, user.id));
      } catch (error) {
        console.error('Error fetching book status:', error);
      }
    })();

    (async () => {
      try {
        setInCollection(await isInCollection(book.isbn, user.id));
      } catch (error) {
        console.error('Error fetching collection status:', error);
      }
    })();
  }, [book.isbn, user]);

  const toggleStatus = async (isbn: string) => {
    if (!user) return;

    try {
      const response = await api.put(`/books-users/${isbn}/${user.id}`);
      setStatus(response.data.status);
      toast.success(`Book marked as ${response.data.status}!`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const removeFromCollection = async (isbn: string) => {
    if (!user) return;

    try {
      await api.delete(`/books-users/${isbn}/${user.id}`);
      setInCollection(false);
      onRemove();
      toast.success('Book removed from your collection!');
    } catch (error) {
      console.error('Error removing from collection:', error);
    }
  };

  if (!inCollection) {
    return null;
  }

  return (
    <Card
      key={book.isbn}
      className="relative border-gray-200 shadow-sm transition-shadow hover:shadow-md"
    >
      <CardContent className="pt-6">
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge
            variant={status === Status.READ ? 'default' : 'outline'}
            className={status === Status.READ ? 'bg-green-600' : 'bg-white'}
          >
            {status}
          </Badge>
          <Badge variant="default" className="bg-indigo-600">
            In Collection
          </Badge>
        </div>

        <h2 className="mb-1 text-xl font-bold text-gray-800">{book.title}</h2>
        <p className="mb-2 text-gray-600">{book.author}</p>

        <div className="mb-4 text-sm text-gray-500">
          <p>Published: {book.year}</p>
          <p>ISBN: {book.isbn}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleStatus(book.isbn)}
            className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Mark as {status === Status.READ ? Status.UNREAD : Status.READ}
          </Button>
        </div>

        <Button
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700"
          size="sm"
          onClick={() => removeFromCollection(book.isbn)}
        >
          <BookMarked className="mr-2 size-4" />
          Remove from Collection
        </Button>
      </CardContent>
    </Card>
  );
}
