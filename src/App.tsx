import { FC } from 'react';
import { Search } from './Component/Search';
import { ErrorBoundary } from './Component/ErrorBoundary';
import { GetGuestRate } from './Component/GetGuestRate';
import { Route, Routes } from 'react-router-dom';
import { NetworkAlert } from './Component/NetWorkAlert';

const App: FC = () => {
  return (
    <>
      <ErrorBoundary>
        <NetworkAlert />
        <Routes>
          <Route path={'/rates'} element={<GetGuestRate />} />
          <Route path={'/'} element={<Search />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export { App };
