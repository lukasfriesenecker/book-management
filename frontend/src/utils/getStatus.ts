import api from '@/api';

export async function getStatus(isbn: string, userId: number) {
  try {
    const response = await api.get(`/books-users/${userId}`);
    const book = response.data.find(
      (book: { isbn: string }) => book.isbn === isbn,
    );

    return book ? book.status : null;
  } catch (error) {
    console.error('Error fetching book status:', error);
  }
}
