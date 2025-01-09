import React, { FC } from 'react';
import { Pagination, Spin, ConfigProvider, Empty } from 'antd';
import { useRatedMovies } from '../../Utils/hooks/useRatedMovies';
import styles from './MovieListSessionRate.module.css';
import { MovieList } from '../MovieList';
import { useGuestAPI } from '../../Utils/hooks';

export const MovieListSessionRate: FC = () => {
  const { movies, loading, totalPages, handleToPage, targetPage } = useRatedMovies();
  useGuestAPI();

  if (movies.length === 0 && !loading) return <Empty />;

  return (
    <>
      <div className={styles.movieCatalog}>{movies.length > 0 ? <MovieList movies={movies} /> : null}</div>
      {loading ? <Spin /> : null}
      {movies.length > 1 ? (
        <ConfigProvider
          theme={{
            token: {
              colorBgTextHover: 'rgb(24, 144, 255)',
              colorBgContainer: 'rgb(51, 51, 60)',
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
            total={totalPages}
          />
        </ConfigProvider>
      ) : null}
    </>
  );
};
