import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../api';
import BookDialog from '@/components/BookDialog';
import { Book } from '@/constants/book';
import { BookGrid } from '@/components/BookGrid';
import { Header } from '@/components/Header';
import { toggleCollection } from '@/utils/toggleCollection';
import { useUser } from '@/contexts/UserContext';

export default function AllBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>({
    isbn: '',
    title: '',
    author: '',
    year: 2000,
  });

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

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)
    );
  });

  const deleteBook = async (isbn: string) => {
    setError('');
    setSuccess('');

    try {
      await api.delete(`/books/${isbn}`);
      setBooks(books.filter((book) => book.isbn !== isbn));

      toast.success('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book. Please try again.');
    }
  };

  function openAddDialog() {
    setSelectedBook({
      isbn: '',
      title: '',
      author: '',
      year: 2000,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  }

  function openEditDialog(book: Book) {
    setSelectedBook({ ...book });
    setIsEditMode(true);
    setIsDialogOpen(true);
  }

  return (
    <div>
      <div className="container mx-auto max-w-7xl p-4">
        <Header
          headline="All Books"
          searchText="Search books..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          buttonText="Add Book"
          handleClick={openAddDialog}
        />

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        {filteredBooks.length === 0 ? (
          <div className="rounded-md border py-12 text-center">
            <p className="text-muted-foreground">
              No books found. Try adjusting your search or add a new book.
            </p>
          </div>
        ) : (
          <BookGrid
            books={filteredBooks}
            onToggleCollection={toggleCollection}
            onDelete={deleteBook}
            onEdit={openEditDialog}
            userId={user?.id || -1}
          />
        )}

        <BookDialog
          isEditMode={isEditMode}
          loading={false}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          selectedBook={selectedBook}
          onSave={(updatedBook: Book) => {
            if (isEditMode) {
              setBooks((prevBooks) =>
                prevBooks.map((book) =>
                  book.isbn === updatedBook.isbn ? updatedBook : book,
                ),
              );
            } else {
              setBooks((prevBooks) => [...prevBooks, updatedBook]);
            }
          }}
        />
      </div>
    </div>
  );
}
