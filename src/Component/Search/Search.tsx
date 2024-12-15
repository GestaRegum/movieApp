import { FC, useState } from 'react';
import { FilmCatalog } from '../FilmCatalog';
import { SearchMenu } from '../SearchInput';
import { ErrorBoundary } from '../ErrorBoundary';
import { GuestAPI } from '../GuestAPI/GuestAPI';

const Search: FC = () => {
  const [query, setQuery] = useState<string>('');
  const [guestSessionID, setGuestSessionID] = useState<string>('');

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const handleSessionId = (id: string) => {
    setGuestSessionID(id);
  };

  return (
    <>
      <ErrorBoundary>
        <SearchMenu onSearch={handleSearch} />
        <FilmCatalog guestSessionID={guestSessionID} query={query} />
        <GuestAPI onGetGuestSessionId={handleSessionId} />
      </ErrorBoundary>
    </>
  );
};

export { Search };
