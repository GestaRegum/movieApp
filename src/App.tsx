import React, { FC } from 'react';
import { Search } from './Component/Search';
import { ErrorBoundary } from './Utils/ErrorBoundary';
import { MovieListSessionRate } from './Component/MovieListSessionRate';
import { Route, Routes } from 'react-router-dom';
import { NetworkAlert } from './Utils/NetWorkAlert';

export const App: FC = () => {
  return (
    <>
      <ErrorBoundary>
        <NetworkAlert />
        <Routes>
          <Route path="/rates" element={<MovieListSessionRate />} />
          <Route path="/" element={<Search />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};
