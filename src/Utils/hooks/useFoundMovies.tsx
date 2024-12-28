import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchQuery } from './useSearchQuery';
import { Movie } from 'type';
import { searchMovies } from '../MyApiForFetchingDifferentDataAboutMoviesFromServer/API';

export const useFoundMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  const [hasMovies, setHasMovies] = useState<boolean>(true);
  const { query } = useSearchQuery();

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

  return { handleToPage, movies, searchLoading, pages, hasMovies, targetPage };
};
