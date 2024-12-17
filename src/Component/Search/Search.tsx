import { FC, useState } from 'react';
import { FilmCatalog } from '../FilmCatalog';
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
        <FilmCatalog query={query} />
      </ErrorBoundary>
    </>
  );
};

export { Search };
