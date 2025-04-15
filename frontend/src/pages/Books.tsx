import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Search, Trash2, BookMarked } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import BookReviewDialog from '@/components/Bookreview';

interface Book {
  isbn: string;
  title: string;
  author: string;
  year: string;
}

interface BookUser {
  userId: number;
  isbn: string;
  status: 'read' | 'unread';
}

export default function AllBooks() {
  const userId = 1;
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookUsers, setBookUsers] = useState<BookUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book>({
    isbn: '',
    title: '',
    author: '',
    year: '',
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
    setCurrentBook({
      isbn: '',
      title: '',
      author: '',
      year: '',
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  }

  // Open dialog for editing an existing book
  function openEditDialog(book: Book) {
    setCurrentBook({ ...book });
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
      ...currentBook,
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
      {/* <Navbar userId={userId} username="admin" /> */}

      <div className="container mx-auto max-w-7xl p-4">
        <header className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-2xl font-bold">All Books</h1>

          <div className="flex w-full gap-2 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search books..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={openAddDialog}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </div>
        </header>

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

        {/* Book Dialog (Add/Edit) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Book' : 'Add New Book'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? 'Update the details of this book.'
                  : 'Enter the details of the book you want to add.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isbn" className="text-right">
                  ISBN
                </Label>
                <Input
                  id="isbn"
                  className="col-span-3"
                  value={currentBook.isbn}
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, isbn: e.target.value })
                  }
                  disabled={isEditMode} // Disable ISBN editing in edit mode
                  placeholder={
                    !isEditMode ? 'Leave empty to generate automatically' : ''
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  value={currentBook.title}
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  Author
                </Label>
                <Input
                  id="author"
                  className="col-span-3"
                  value={currentBook.author}
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, author: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Input
                  id="year"
                  className="col-span-3"
                  value={currentBook.year}
                  onChange={(e) =>
                    setCurrentBook({ ...currentBook, year: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4"></div>
              {!isEditMode && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right">Collection</div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="collection-status"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      defaultChecked={false}
                    />
                    <Label htmlFor="collection-status">Add to collection</Label>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={addOrUpdateBook}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditMode ? 'Save Changes' : 'Add Book'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface BookGridProps {
  books: Book[];
  bookUsers: BookUser[];
  onToggleCollection: (isbn: string) => void;
  onDelete: (isbn: string) => void;
  onEdit: (book: Book) => void;
  userId: number;
}

function BookGrid({
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
