import React, { FC, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Pagination, Spin, ConfigProvider, Empty } from 'antd';
import { fetchRatedMovies } from '../../Utils/MyApiForFetchingDifferentDataAboutMoviesFromServer/API';
import styles from './MovieList.module.css';
import { Movie } from 'type';
import { MovieCard } from '../MovieCard';

export const MovieList: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  const sessionId = sessionStorage.getItem('sessionId');

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('sessionId');
    const previousSessionId = localStorage.getItem('previousSessionId');

    if (storedSessionId !== previousSessionId) {
      localStorage.removeItem('ratings');
      localStorage.setItem('previousSessionId', storedSessionId || '');
      setRatings({});
    }
  }, [sessionId]);

  useEffect(() => {
    const storedRatings = localStorage.getItem('ratings');
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    }
  }, []);

  const sessionRateMovies = useDebouncedCallback(async (page: number) => {
    try {
      setSearchLoading(true);
      const movies = await fetchRatedMovies(sessionId, page);

      const { id, total_results, rating } = movies;

      setMovies(
        movies.results.map((movie: Movie) => ({
          ...movie,
          rating: ratings[id] || rating || 0,
        }))
      );
      setPages(total_results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  }, 1000);

  useEffect(() => {
    sessionRateMovies(targetPage);
  }, [targetPage]);

  const handleToPage = (page: number) => {
    setTargetPage(page);
    sessionRateMovies(page);
  };

  if (movies.length === 0) {
    return <Empty />;
  }

  return (
    <>
      <div className={styles.movieCatalog}>{movies.length > 0 ? <MovieCard Movies={movies} /> : null}</div>
      {searchLoading ? <Spin /> : null}
      {movies.length === 1 ? null : (
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
      )}
    </>
  );
};
