import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DialogInput from '@/components/DialogInput';
import { BookOpen, Calendar, Text, User } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api';
import { Book } from '@/constants/book';

interface BookDialogProps {
  isEditMode: boolean;
  loading: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedBook: Book;
  onSave: (book: Book) => void;
}

export default function BookDialog({
  isEditMode,
  loading,
  isDialogOpen,
  setIsDialogOpen,
  selectedBook,
  onSave,
}: BookDialogProps) {
  const [formData, setFormData] = useState<Book>(selectedBook);

  useEffect(() => {
    setFormData(selectedBook);
  }, [selectedBook]);

  const handleInputChange =
    (field: keyof Book) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === 'year' ? (value === '' ? '' : Number(value)) : value,
      }));
    };

  const addOrUpdateBook = async () => {
    if (
      !formData.isbn ||
      !formData.title ||
      !formData.author ||
      !formData.year
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.isbn.length < 13 || formData.isbn.length > 13) {
      toast.error('ISBN must be at exactly 13 characters long');
      return;
    }

    if (formData.year < 0) {
      toast.error('Year cannot be negative');
      return;
    }

    if (formData.year > new Date().getFullYear()) {
      toast.error('Year cannot be in the future');
      return;
    }

    try {
      let response;

      if (isEditMode) {
        response = await api.put(`/books/${selectedBook?.isbn}`, {
          title: formData.title,
          author: formData.author,
          year: formData.year,
        });
        toast.success('Book updated successfully');
      } else {
        response = await api.post('/books', formData);
        toast.success('Book added successfully');
      }

      setIsDialogOpen(false);
      onSave(response.data);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the book details.'
              : 'Enter the details of the new book.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DialogInput
            label="ISBN"
            icon={<BookOpen />}
            type="text"
            identifier="isbn"
            value={formData.isbn}
            onChange={handleInputChange('isbn')}
            disabled={loading || isEditMode}
          />

          <DialogInput
            label="Title"
            icon={<Text />}
            type="text"
            identifier="title"
            value={formData.title}
            onChange={handleInputChange('title')}
            disabled={loading}
          />

          <DialogInput
            label="Author"
            icon={<User />}
            type="text"
            identifier="author"
            value={formData.author}
            onChange={handleInputChange('author')}
            disabled={loading}
          />

          <DialogInput
            label="Year"
            icon={<Calendar />}
            type="number"
            identifier="year"
            value={formData.year.toString()}
            onChange={handleInputChange('year')}
            disabled={loading}
          />
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={addOrUpdateBook}
            className="cursor-pointer bg-indigo-600 hover:bg-indigo-700"
          >
            {isEditMode ? 'Save Changes' : 'Add Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
