import { FC, useState } from 'react';
import { MovieCatalog } from '../MovieCatalog';
import { SearchInput } from '../SearchInput';
import { ErrorBoundary } from '../../Utils/ErrorBoundary';

export const Search: FC = () => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  return (
    <>
      <ErrorBoundary>
        <SearchInput onSearch={handleSearch} />
        <MovieCatalog query={query} />
      </ErrorBoundary>
    </>
  );
};

