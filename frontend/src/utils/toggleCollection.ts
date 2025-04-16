import api from '@/api';
import { isInCollection } from './isInCollection';

export async function toggleCollection(isbn: string, userId: number) {
  const inCollection = await isInCollection(isbn, userId);

  try {
    if (inCollection) {
      await api.delete(`/books-users/${isbn}/${userId}`);
    } else {
      await api.post(`/books-users/${isbn}/${userId}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating collection:', error);
  }
}
