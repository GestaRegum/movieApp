import { FC, useState } from 'react';
import { MovieCatalog } from '../MovieCatalog';
import { SearchMenu } from '../SearchInput';
import { ErrorBoundary } from '../ErrorBoundary';

const Search: FC = () => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  return (
    <>
      <ErrorBoundary>
        <SearchMenu onSearch={handleSearch} />
        <MovieCatalog query={query} />
      </ErrorBoundary>
    </>
  );
};

export { Search };
