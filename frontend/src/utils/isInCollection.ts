import api from '@/api';

export async function isInCollection(isbn: string, userId: number) {
  const response = await api.get(`/books-users/${userId}`);

  return response.data.some((book: { isbn: string }) => book.isbn === isbn);
}
