import React, { FC } from 'react';
import { Movie } from 'type';
import { MovieCard } from '../MovieCard';

export const MovieList: FC<{ movies: Movie[] }> = ({ movies }) => {
  return movies.map((movie: Movie) => {
    return <MovieCard movie={movie} key={movie.id} />;
  });
};
