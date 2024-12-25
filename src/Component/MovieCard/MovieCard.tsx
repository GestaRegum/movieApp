import classNames from 'classnames';
import { Genres, Movie } from 'type';
import { urlImageMovie } from '../../Utils/MyApiForFetchingDifferentDataAboutMoviesFromServer/urlAndOptions';
import styles from '../MovieCatalog/MovieCatalog.module.css';
import { format } from 'date-fns';
import { Rate } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useNetworkState } from 'react-use';
import { rateMovie } from '../../Utils/MyApiForFetchingDifferentDataAboutMoviesFromServer/API';
import { useGenres } from '../../Utils/hooks';

function miniOverview(text: string, length = 60): string {
  if (text.length <= length) return text;
  return text.slice(0, text.indexOf(' ', length)) + '...';
}

export const MovieCard: FC<{ Movies: Movie[] }> = ({ Movies }) => {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const isOnline = useNetworkState();
  const sessionId = sessionStorage.getItem('sessionId');
  const { genres } = useGenres();

  useEffect(() => {
    const storedRatings = localStorage.getItem('ratings');
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    }
  }, []);

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('sessionId');
    const previousSessionId = localStorage.getItem('previousSessionId');

    if (storedSessionId !== previousSessionId) {
      localStorage.removeItem('ratings');
      localStorage.setItem('previousSessionId', storedSessionId || '');
      setRatings({});
    }
  }, [sessionId]);

  const handleRateChange = (movieId: number) => async (value: number) => {
    if (!isOnline.online) return;

    try {
      await rateMovie(movieId, sessionId, value);

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

  const movieCardImg = (movie: Movie) => {
    const { title, poster_path } = movie;
    return <img className={classNames(styles.poster_path)} src={`${urlImageMovie}${poster_path}`} alt={title} />;
  };

  const movieCardTitleAndVoteAverage = (movie: Movie) => {
    const { title, vote_average } = movie;

    return (
      <div className={classNames(styles.title_popularity)}>
        <p className={classNames(styles.title)}>{title}</p>
        <p
          className={classNames(
            styles.popularity,
            { [styles.popularityFrom7]: 7 <= vote_average },
            { [styles.popularityFrom5To7]: 5 <= vote_average },
            { [styles.popularityFrom3To5]: 3 <= vote_average },
            { [styles.popularityFrom0To3]: 0 <= vote_average }
          )}
        >
          {vote_average.toFixed(1)}
        </p>
      </div>
    );
  };

  const movieCardReleaseDate = (movie: Movie) => {
    const { release_date } = movie;

    return (
      <p className={classNames(styles.release_date)}>
        {release_date ? format(new Date(release_date), 'MMMM dd, yyyy') : 'Дата не указана'}
      </p>
    );
  };

  const movieCardGenre = (movie: Movie) => {
    const movieGenres = movie.genre_ids
      .map((id) => genres.find((genre: Genres) => genre.id === id)?.name)
      .filter((name) => name);

    return movieGenres.map((genre) => (
      <span key={genre} className={classNames(styles.genreTag)}>
        {genre}
      </span>
    ));
  };

  const movieCardOvervie = (movie: Movie) => {
    const { overview } = movie;
    return <p className={classNames(styles.overview)}>{miniOverview(overview)}</p>;
  };

  const movieCardStarRate = (movie: Movie) => {
    const { rating, id } = movie;
    return (
      <div className={classNames(styles.rate)}>
        <Rate
          className={classNames(styles.customRate)}
          count={10}
          allowHalf
          value={rating || ratings[id] || 0}
          onChange={handleRateChange(id)}
        />
      </div>
    );
  };

  const movieCard = Movies.map((movie: Movie) => {
    return (
      <div className={classNames(styles.movieConteiner)} key={movie.id}>
        {movieCardImg(movie)}
        <div className={classNames(styles.aboutMovie)}>
          {movieCardTitleAndVoteAverage(movie)}
          {movieCardReleaseDate(movie)}
          <div className={styles.genresContainer}>{movieCardGenre(movie)}</div>
          {movieCardOvervie(movie)}
          {movieCardStarRate(movie)}
        </div>
      </div>
    );
  });

  return movieCard;
};
