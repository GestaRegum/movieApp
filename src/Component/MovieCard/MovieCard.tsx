import classNames from 'classnames';
import { Movie } from 'type';
import { urlImageMovie } from '../../Utils/MyApiForFetchingDifferentDataAboutMoviesFromServer/urlAndOptions';
import styles from './MovieCard.module.css';
import { format } from 'date-fns';
import { Rate } from 'antd';
import React, { FC } from 'react';
import { useMovieCartAndChangeRate } from '../../Utils/hooks';

export const MovieCard: FC<{ Movies: Movie[] }> = ({ Movies }) => {
  const { ratings, movieGenresFilter, handleRateChange, miniOverview } = useMovieCartAndChangeRate();

  const movieCard = Movies.map((movie: Movie) => {
    const movieGenres = movieGenresFilter(movie);
    return (
      <div className={classNames(styles.movieConteiner)} key={movie.id}>
        <img
          className={classNames(styles.poster_path)}
          src={`${urlImageMovie}${movie.poster_path}`}
          alt={movie.title}
        />
        <div className={classNames(styles.aboutMovie)}>
          <div className={classNames(styles.title_popularity)}>
            <p className={classNames(styles.title)}>{movie.title}</p>
            <p
              className={classNames(
                styles.popularity,
                { [styles.popularityFrom7]: 7 <= movie.vote_average },
                { [styles.popularityFrom5To7]: 5 <= movie.vote_average },
                { [styles.popularityFrom3To5]: 3 <= movie.vote_average },
                { [styles.popularityFrom0To3]: 0 <= movie.vote_average }
              )}
            >
              {movie.vote_average.toFixed(1)}
            </p>
          </div>
          <p className={classNames(styles.release_date)}>
            {movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'Дата не указана'}
          </p>
          <div className={styles.genresContainer}>
            {movieGenres.map((genre) => (
              <span key={genre} className={classNames(styles.genreTag)}>
                {genre}
              </span>
            ))}
          </div>
          <p className={classNames(styles.overview)}>{miniOverview(movie.overview)}</p>
          <div className={classNames(styles.rate)}>
            <Rate
              className={classNames(styles.customRate)}
              count={10}
              allowHalf
              value={movie.rating ? movie.rating : ratings[movie.id] || 0}
              onChange={handleRateChange(movie.id)}
            />
          </div>
        </div>
      </div>
    );
  });

  return movieCard;
};
