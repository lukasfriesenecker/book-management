import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import BookDialog from '@/components/BookDialog';
import { Book } from '@/constants/book';
import { BookUser } from '@/constants/book-user';
import { BookGrid } from '@/components/BookGrid';
import { Header } from '@/components/Header';

export default function AllBooks() {
  const userId = 1;
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookUsers, setBookUsers] = useState<BookUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>({
    isbn: '',
    title: '',
    author: '',
    year: -1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchBooks();
    await fetchBookUsers();
  };

  // Fetch Books from API
  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      if (response.status === 200) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
    }
  };

  // Fetch user's book collection
  const fetchBookUsers = async () => {
    try {
      const response = await api.get(`/books-users/${userId}`);
      if (response.status === 200) {
        setBookUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching user's books:", error);
      setError('Failed to load your collection. Please try again.');
    }
  };

  // Check if a book is in the user's collection
  const isInCollection = (isbn: string): boolean => {
    return bookUsers.some((bu) => bu.isbn === isbn);
  };

  // Filter books based on search query
  const filteredBooks = books.filter((book) => {
    // Filter by search query
    return (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)
    );
  });

  // Toggle collection status
  const toggleCollection = async (isbn: string) => {
    setError('');
    setSuccess('');

    if (!userId) {
      toast.error('User ID missing.');
      return;
    }

    const book = books.find((b) => b.isbn === isbn);
    if (!book) {
      console.warn(`Book with ISBN ${isbn} not found`);
      toast.error('Book not found.');
      return;
    }

    const inCollection = isInCollection(isbn);

    try {
      if (inCollection) {
        await api.delete(`/books-users/${isbn}/${userId}`);
        toast.success('Book removed from your collection!');
      } else {
        await api.post(`/books-users/${isbn}/${userId}`);
        console.log(`Calling: /books-users/${isbn}/${userId}`);
        console.log('Book added to collection:', isbn);
        toast.success('Book added to your collection!');
      }

      await fetchBookUsers();
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error(
        inCollection
          ? 'Failed to remove book from collection. Please try again.'
          : 'Failed to add book to collection. Please try again.',
      );
      setError('Something went wrong. Please try again later.');
    }
  };

  // Delete book
  const deleteBook = async (isbn: string) => {
    setError('');
    setSuccess('');

    try {
      // If book is in collection, remove it first
      if (isInCollection(isbn)) {
        await api.delete(`/books-users/${isbn}/${userId}`);
      }

      // Delete the book
      await api.delete(`/books/${isbn}`);
      toast.success('Book deleted successfully!');

      // Update local state
      setBooks(books.filter((book) => book.isbn !== isbn));
      await fetchBookUsers();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book. Please try again.');
    }
  };

  // Open dialog for adding a new book
  function openAddDialog() {
    setSelectedBook({
      isbn: '',
      title: '',
      author: '',
      year: -1,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  }

  // Open dialog for editing an existing book
  function openEditDialog(book: Book) {
    setSelectedBook({ ...book });
    setIsEditMode(true);
    setIsDialogOpen(true);
  }

  // Generate a random ISBN if none is provided
  function generateISBN() {
    return `978${Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, '0')}`;
  }

  // Add or update a book
  const addOrUpdateBook = async () => {
    setError('');
    setSuccess('');

    const bookToSave = {
      ...selectedBook,
    };

    if (bookToSave.isbn.length === 0) {
      bookToSave.isbn = generateISBN();
    }

    try {
      if (isEditMode) {
        // Update existing book
        const response = await api.put(`/books/${bookToSave.isbn}`, bookToSave);
        toast.success('Book updated successfully!');

        // Update the book in local state
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.isbn === bookToSave.isbn ? response.data : book,
          ),
        );

        // If the book is in the user's collection, update the status there too
        if (isInCollection(bookToSave.isbn)) {
          await api.put(`/books-users/${bookToSave.isbn}/${userId}`);
        }
      } else {
        // Check if ISBN already exists
        if (books.some((book) => book.isbn === bookToSave.isbn)) {
          setError(
            'A book with this ISBN already exists. Please use a different ISBN.',
          );
          return;
        }

        // Add new book
        const response = await api.post('/books', bookToSave);
        toast.success('Book added successfully!');
        setBooks([...books, response.data]);

        // Add to collection if checkbox was checked
        const addToCollection = document.getElementById(
          'collection-status',
        ) as HTMLInputElement;
        if (addToCollection && addToCollection.checked) {
          await api.post(`/books-users/${bookToSave.isbn}/${userId}`);
          await fetchBookUsers();
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error(
        isEditMode
          ? 'Failed to update book. Please try again.'
          : 'Failed to add book. Please try again.',
      );
    }
  };

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
            bookUsers={bookUsers}
            onToggleCollection={toggleCollection}
            onDelete={deleteBook}
            onEdit={openEditDialog}
            userId={userId}
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
