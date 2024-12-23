/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNetworkState } from 'react-use';
import classNames from 'classnames';
import { format } from 'date-fns';
import { Pagination, Rate, Spin, ConfigProvider, Empty } from 'antd';
import { fetchRatedMovies, rateMovie } from '../WorkWithAPI/apiService';
import styles from '../MovieCatalog/MovieCatalog.module.css';
import { Movie, Genres } from 'type';
import { urlImageMovie } from '../WorkWithAPI/urlAndOptions';

function miniOverview(text: string, length = 60): string {
  if (text.length <= length) return text;
  return text.slice(0, text.indexOf(' ', length)) + '...';
}

const GetGuestRate: FC = () => {
  const [guestRate, setGuestRate] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  const genresFromLocalStorage = JSON.parse(localStorage.getItem('genres') || '[]');
  const sessionId = sessionStorage.getItem('sessionId');
  const isOnline = useNetworkState();

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

  const handleRateChange = (movieId: number) => async (value: number) => {
    if (!isOnline.online) return null;

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
      console.error(error);
    }
  };

  const MyRateMovie = useDebouncedCallback(async (page: number) => {
    try {
      setSearchLoading(true);
      const movies = await fetchRatedMovies(sessionId, page);

      setGuestRate(
        movies.results.map((movie: Movie) => ({
          ...movie,
          rating: ratings[movie.id] || movie.rating || 0,
        }))
      );
      setPages(movies.total_results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  }, 1000);

  useEffect(() => {
    MyRateMovie(targetPage);
  }, [targetPage]);

  const handleToPage = (page: number) => {
    setTargetPage(page);
    MyRateMovie(page);
  };

  if (guestRate.length === 0) {
    return <Empty />;
  }

  const myRatesMovies = guestRate.map((movie) => {
    return (
      <div className={styles.movieConteiner} key={movie.id}>
        <img
          className={classNames(styles.poster_path)}
          src={`${urlImageMovie}${movie.poster_path}`}
          alt={movie.title}
        />
        <div className={styles.aboutMovie}>
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
            {movie.genre_ids
              .map((id) => genresFromLocalStorage.find((genre: Genres) => genre.id === id)?.name)
              .filter((name) => name)
              .map((genre) => (
                <span key={genre} className={classNames(styles.genreTag)}>
                  {genre}
                </span>
              ))}
          </div>
          <p className={classNames(styles.overview)}>{miniOverview(movie.overview)}</p>
          <Rate
            style={{ fontSize: 15 }}
            count={10}
            allowHalf
            value={movie.rating}
            onChange={handleRateChange(movie.id)}
          />
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={styles.movieCatalog}>{guestRate.length > 0 ? myRatesMovies : null}</div>
      {searchLoading ? <Spin /> : null}
      {myRatesMovies.length === 0 ? null : (
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

export { GetGuestRate };
