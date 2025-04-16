import api from '@/api';
import { toast } from 'sonner';
import { isInCollection } from './isInCollection';

export async function toggleCollection(isbn: string, userId: number) {
  const inCollection = await isInCollection(isbn, userId);

  try {
    if (inCollection) {
      await api.delete(`/books-users/${isbn}/${userId}`);
      toast.success('Book removed from your collection!');
    } else {
      await api.post(`/books-users/${isbn}/${userId}`);
      toast.success('Book added to your collection!');
    }

    return true;
  } catch (error) {
    console.error('Error updating collection:', error);
    toast.error(
      inCollection
        ? 'Failed to remove book from collection. Please try again.'
        : 'Failed to add book to collection. Please try again.',
    );
  }
}
