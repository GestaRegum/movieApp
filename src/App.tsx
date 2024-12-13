import { FC } from 'react';
import { Search } from './Search';
import { ErrorBoundary } from './Component/ErrorBoundary';
import { GetGuestRate } from './Component/GetGuestRate/GetGuestRate';
import { Route, Routes } from 'react-router-dom';

const App: FC = () => {
  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/rates" element={<GetGuestRate />} />
          <Route path="/" element={<Search />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export { App };
