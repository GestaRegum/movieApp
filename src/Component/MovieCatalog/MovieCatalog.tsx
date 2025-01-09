import React, { FC } from 'react';

import { Spin, Pagination, Alert, ConfigProvider } from 'antd';

import { useFoundMovies, useGuestAPI } from '../../Utils/hooks';
import styles from './MovieCatalog.module.css';
import { MovieList } from '../MovieList';

export const MovieCatalog: FC = () => {
  const { handleToPage, movies, searchLoading, pages, hasMovies, targetPage } = useFoundMovies();

  useGuestAPI();

  return (
    <>
      {!hasMovies ? (
        <Alert message="Такой фильм еще не сняли :(" />
      ) : (
        <div className={styles.movieCatalog}>
          <MovieList movies={movies} />
        </div>
      )}

      {searchLoading ? <Spin size="large" /> : null}

      {movies.length > 1 ? (
        <ConfigProvider
          theme={{
            token: {
              colorBgTextHover: 'rgb(24, 144, 255)',
              colorBgContainer: 'rgb(51, 51, 60);',
              colorText: 'rgb(255, 255, 255)',
              colorTextDisabled: 'rgba(255, 255, 255, 0.35)',
              colorPrimary: 'rgb(255, 255, 255)',
            },
          }}
        >
          <Pagination
            style={{ marginTop: 24 }}
            current={targetPage}
            onChange={handleToPage}
            defaultPageSize={20}
            align="center"
            showSizeChanger={false}
            defaultCurrent={1}
            total={pages}
          />
        </ConfigProvider>
      ) : null}
    </>
  );
};
