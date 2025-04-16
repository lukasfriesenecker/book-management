import { Plus, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface HeaderProps {
  headline: string;
  searchText?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  buttonText?: string;
  handleClick?: () => void;
}

export function Header({
  headline,
  searchText,
  searchQuery,
  setSearchQuery,
  buttonText,
  handleClick,
}: HeaderProps) {
  return (
    <header className="mt-6 mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
      <h1 className="text-2xl font-bold">{headline}</h1>

      <div className="flex w-full gap-2 md:w-auto">
        {searchText && (
          <div className="relative flex-1 md:w-64">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
            <Input
              placeholder={searchText}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </div>
        )}

        {buttonText && (
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleClick}
          >
            <Plus className="mr-2 size-4" />
            {buttonText}
          </Button>
        )}
      </div>
    </header>
  );
}
