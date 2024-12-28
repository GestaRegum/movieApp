import { useEffect, useState } from 'react';
import { useNetworkState } from 'react-use';
import { useGenres } from './useGenres';
import { rateMovie } from '../MyApiForFetchingDifferentDataAboutMoviesFromServer/API';
import { Genres, Movie } from 'type';

export const useMovieCartAndChangeRate = () => {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const isOnline = useNetworkState();
  const { genres } = useGenres();

  useEffect(() => {
    const savedRatings = localStorage.getItem('ratings');
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  const movieGenresFilter = (movie: Movie) => {
    return movie.genre_ids.map((id) => genres.find((genre: Genres) => genre.id === id)?.name).filter((name) => name);
  };

  const miniOverview = (text: string, length = 60): string => {
    if (text.length <= length) return text;
    return text.slice(0, text.indexOf(' ', length)) + '...';
  };

  const handleRateChange = (movieId: number) => async (value: number) => {
    if (!isOnline.online) return;
    try {
      await rateMovie(movieId, value);

      setRatings((prev) => {
        const updatedRatings = { ...prev };

        if (value === 0) {
          delete updatedRatings[movieId];
        } else {
          updatedRatings[movieId] = value;
        }

        localStorage.setItem('ratings', JSON.stringify(updatedRatings));

        return updatedRatings;
      });
    } catch (error) {
      console.error('Ошибка при оценке фильма:', error);
    }
  };

  return { ratings, genres, handleRateChange, miniOverview, movieGenresFilter };
};
