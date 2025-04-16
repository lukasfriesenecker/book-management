import { Card, CardContent } from './ui/card';
import React from 'react';

interface BookCountCardProps {
  text: string;
  count: number;
  icon: React.ReactElement<{ className?: string }>;
}

export function BookCountCard({ text, count, icon }: BookCountCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-gray-500">{text}</p>
          <h3 className="text-2xl font-bold">{count}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          {React.cloneElement(icon, { className: 'size-6 text-indigo-600' })}
        </div>
      </CardContent>
    </Card>
  );
}
