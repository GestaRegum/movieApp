import React, { FC } from 'react';
import { MovieCatalog } from '../MovieCatalog';
import { SearchInput } from '../SearchInput';
import { ErrorBoundary } from '../../Utils/ErrorBoundary';
import { SearchProvider } from '../../Utils/hooks/useSearchQuery';

export const Search: FC = () => {
  return (
    <>
      <SearchProvider>
        <ErrorBoundary>
          <SearchInput />
          <MovieCatalog />
        </ErrorBoundary>
      </SearchProvider>
    </>
  );
};
