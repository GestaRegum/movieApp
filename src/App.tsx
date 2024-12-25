import { FC } from 'react';
import { Search } from './Component/Search';
import { ErrorBoundary } from './Utils/ErrorBoundary';
import { MovieList } from './Component/MovieList';
import { Route, Routes } from 'react-router-dom';
import { NetworkAlert } from './Utils/NetWorkAlert';

export const App: FC = () => {
  return (
    <>
      <ErrorBoundary>
        <NetworkAlert />
        <Routes>
          <Route path="/rates" element={<MovieList />} />
          <Route path="/" element={<Search />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};
