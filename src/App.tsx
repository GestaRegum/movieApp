import { FC } from 'react';
import { Search } from './Component/Search/Search';
import { ErrorBoundary } from './Component/ErrorBoundary';
import { GetGuestRate } from './Component/GetGuestRate/GetGuestRate';
import { Route, Routes } from 'react-router-dom';
import { NetWork } from './Component/NetWork/NetWork';

const App: FC = () => {
  return (
    <>
      <ErrorBoundary>
        <NetWork />
        <Routes>
          <Route path="/rates" element={<GetGuestRate />} />
          <Route path="/" element={<Search />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export { App };
