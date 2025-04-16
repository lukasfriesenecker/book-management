import { CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Progress } from './ui/progress';
import { useNavigate } from 'react-router-dom';

interface ProgressCardProps {
  totalBooks: number;
  readBooks: number;
  readPercentage: number;
}

export function ProgressCard({
  totalBooks,
  readBooks,
  readPercentage,
}: ProgressCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle2 className="mr-2 h-5 w-5 text-indigo-600" />
          Reading Progress
        </CardTitle>
        <CardDescription>Your collection reading status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">Read Books</span>
              <span className="text-sm font-medium">
                {readBooks} of {totalBooks}
              </span>
            </div>
            <Progress value={readPercentage} className="h-2 bg-indigo-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="text-3xl font-bold text-indigo-600">
                {readBooks}
              </div>
              <div className="text-sm text-gray-500">Read</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="text-3xl font-bold text-indigo-600">
                {totalBooks - readBooks}
              </div>
              <div className="text-sm text-gray-500">Unread</div>
            </div>
          </div>

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate(`/collection`)}
          >
            View Collection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
