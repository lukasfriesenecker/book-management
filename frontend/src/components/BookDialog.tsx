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
import { Book, Calendar, PersonStanding, Text } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api';

interface Book {
  isbn: string;
  title: string;
  author: string;
  year: number;
}

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
    /*if (!formData.username || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditMode && (!formData.password || !formData.confirmPassword)) {
      toast.error('Please provide a password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }*/

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

      onSave(response.data);
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
            icon={<Book />}
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
            icon={<PersonStanding />}
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
