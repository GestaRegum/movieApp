import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './MovieList.module.css';
import { urlImageMovie } from '../../Utils/MyApiForFetchingDifferentDataAboutMoviesFromServer/urlAndOptions';
import { useMovieCartAndChangeRate } from '../../Utils/hooks';
import { format } from 'date-fns';
import { Rate } from 'antd';
import { MovieCardType } from 'type';

export const MovieCard: FC<MovieCardType> = ({ movie }) => {
  const { ratings, movieGenresFilter, handleRateChange, miniOverview } = useMovieCartAndChangeRate();
  const movieGenres = movieGenresFilter(movie);
  return (
    <div className={classNames(styles.movieConteiner)}>
      <img className={classNames(styles.poster_path)} src={`${urlImageMovie}${movie.poster_path}`} alt={movie.title} />
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
            value={ratings[movie.id] || movie.rating || 0}
            onChange={handleRateChange(movie.id)}
          />
        </div>
      </div>
    </div>
  );
};
