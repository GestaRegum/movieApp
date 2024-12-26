import React, { FC, useEffect, useState } from 'react';
import { Movie } from 'type';
import { Spin, Pagination, Alert, ConfigProvider } from 'antd';
import { useDebouncedCallback } from 'use-debounce';
import { searchMovies } from '../../Utils/MyApiForFetchingDifferentDataAboutMoviesFromServer/API';
import { useGuestAPI, useSearchQuery } from '../../Utils/hooks';
import styles from './MovieCatalog.module.css';
import { MovieCard } from '../MovieCard';

export const MovieCatalog: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  const [hasMovies, setHasMovies] = useState<boolean>(true);
  const { query } = useSearchQuery();

  useGuestAPI();

  const fetchMovies = useDebouncedCallback(async (query: string, cur: number) => {
    if (query === '') {
      setPages(1);
      setMovies([]);
      setTargetPage(1);
      setSearchLoading(false);
      return;
    }

    try {
      setMovies([]);
      setSearchLoading(true);

      const movieData = await searchMovies(query, cur);

      if (movieData.total_results === 0) {
        setPages(1);
        setMovies([]);
        setSearchLoading(false);
        setHasMovies(false);
        return;
      }

      setHasMovies(true);
      setPages(movieData.total_results);
      setMovies(movieData.results);
    } catch (error) {
      console.error('Ошибка при загрузке фильмов:', error);
    } finally {
      setSearchLoading(false);
    }
  }, 2000);

  useEffect(() => {
    fetchMovies(query, targetPage);
  }, [query, targetPage, fetchMovies]);

  const handleToPage = (page: number) => {
    setTargetPage(page);
    fetchMovies(query, page);
  };

  return (
    <>
      {!hasMovies ? (
        <Alert message="Такой фильм еще не сняли :(" />
      ) : (
        <div className={styles.movieCatalog}>
          <MovieCard Movies={movies} />
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
