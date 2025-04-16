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
import { toast } from 'sonner';
import api from '@/api';
import { Status } from '@/constants/status';

interface BookCardCollectionProps {
  book: Book;
  handleDelete?: (isbn: string) => void;
  handleEdit?: (book: Book) => void;
  onRemove: () => void;
}

export function BookCardCollection({
  book,
  handleDelete,
  handleEdit,
  onRemove,
}: BookCardCollectionProps) {
  const [inCollection, setInCollection] = useState(false);
  const [status, setStatus] = useState<string>();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchCollectionStatus = async () => {
      setInCollection(await isInCollection(book.isbn, user?.id));
    };
    fetchCollectionStatus();
  }, [book.isbn, user]);

  const toggleReadStatus = async (isbn: string) => {
    if (!user) return;

    try {
      const response = await api.put(`/books-users/${isbn}/${user.id}`);
      setStatus(response.data.status);
      toast.success(`Book marked as STATUS!`);
    } catch (error) {
      console.error('Error updating read status:', error);
      toast.error('Failed to update read status. Please try again.');
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
      toast.error('Failed to remove book from collection. Please try again.');
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
            variant={status === 'read' ? 'default' : 'outline'}
            className={status === 'read' ? 'bg-green-600' : ''}
          >
            {status === Status.UNREAD ? 'Read' : 'Unread'}
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
            onClick={() => toggleReadStatus(book.isbn)}
            className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Mark as {status}
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
}
