import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Genres, Movie, Search } from 'type';
import { Spin, Pagination, Rate, Alert, ConfigProvider } from 'antd';
import { useDebouncedCallback } from 'use-debounce';
import { searchMovies, rateMovie } from '../WorkWithAPI/apiService';
import { urlImageMovie } from '../WorkWithAPI/urlAndOptions';
import { useGuestAPI } from '../MyHooks';
import { useNetworkState } from 'react-use';
import styles from './MovieCatalog.module.css';
import classNames from 'classnames';

function miniOverview(text: string, length = 60): string {
  if (text.length <= length) return text;
  return text.slice(0, text.indexOf(' ', length)) + '...';
}

const MovieCatalog: FC<Search> = ({ query }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [hasMovies, setHasMovies] = useState<boolean>(true);
  const genresFromLocalStorage = JSON.parse(localStorage.getItem('genres') || '[]');
  const isOnline = useNetworkState();
  const sessionId = sessionStorage.getItem('sessionId');

  useGuestAPI();

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

  const handleToPage = (page: number) => {
    setTargetPage(page);
    fetchMovies(query, page);
  };

  const movieCatalog = movies.map((movie) => {
    const movieGenres = movie.genre_ids
      .map((id) => genresFromLocalStorage.find((genre: Genres) => genre.id === id)?.name)
      .filter((name) => name);

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
              value={ratings[movie.id] || 0}
              onChange={handleRateChange(movie.id)}
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {!hasMovies && <Alert message={'Такой фильм еще не сняли :('} />}
      <div className={styles.movieCatalog}>{movieCatalog}</div>
      {searchLoading && <Spin size={'large'} />}
      {movieCatalog.length > 0 && (
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
            align={'center'}
            showSizeChanger={false}
            defaultCurrent={1}
            total={pages}
          />
        </ConfigProvider>
      )}
    </>
  );
};

export { MovieCatalog };
