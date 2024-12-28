import { useState, useEffect } from 'react';
import { fetchRatedMovies } from '../MyApiForFetchingDifferentDataAboutMoviesFromServer/API';
import { Movie } from 'type';

export const useRatedMovies = () => {
  const sessionId = sessionStorage.getItem('sessionId');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);

  useEffect(() => {
    fetchMovies(targetPage);
  }, [targetPage]);

  const handleToPage = (page: number) => {
    setTargetPage(page);
    fetchMovies(page);
  };

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

  const fetchMovies = async (page: number) => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const moviesData = await fetchRatedMovies(page);
      const { total_results, results } = moviesData;

      setMovies(
        results.map((movie: Movie) => ({
          ...movie,
          rating: ratings[movie.id] || movie.rating || 0,
        }))
      );
      setTotalPages(total_results);
    } catch (err) {
      console.error('Error fetching rated movies:', err);
    } finally {
      setLoading(false);
    }
  };

  return { movies, ratings, loading, totalPages, handleToPage, targetPage };
};
