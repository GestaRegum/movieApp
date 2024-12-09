import { FC, useState } from 'react';
import { FilmCatalog } from './Component/FilmCatalog';
import { Search } from './Component/SearchMenu';
import { ErrorBoundary } from './Component/ErrorBoundary';

const App: FC = () => {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  return (
    <>
      <ErrorBoundary>
        <Search onSearch={handleSearch} />
        <FilmCatalog query={query} />
      </ErrorBoundary>
    </>
  );
};

export { App };
