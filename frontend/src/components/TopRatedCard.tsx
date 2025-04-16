import { Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

export function TopRatedCard({
  topRatedBooks,
}: {
  topRatedBooks: {
    isbn: string;
    title: string;
    author: string;
    year: number;
    avgRating: number;
  }[];
}) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5 text-indigo-600" />
          Top Rated Books
        </CardTitle>
        <CardDescription>Highest rated books in the library</CardDescription>
      </CardHeader>
      <CardContent>
        {topRatedBooks.length > 0 ? (
          <div className="space-y-4">
            {topRatedBooks.map((book) => (
              <div
                key={book.isbn}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{book.title}</h4>
                  <p className="text-sm text-gray-500">
                    {book.author}, {book.year}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          star <= Math.round(book.avgRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {book.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No rated books yet. Start rating books to see them here!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
