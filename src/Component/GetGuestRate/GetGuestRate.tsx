import { FC, useEffect, useState } from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';
import { Pagination, Rate, Alert, Spin, ConfigProvider } from 'antd';
import styles from '../FilmCatalog/FilmCatalog.module.css';
import { FilmType } from 'type';
import { useGenres } from '../Context';

const urlImageMovie = 'https://image.tmdb.org/t/p/original/';

function miniOverview(text: string, length = 60): string {
  if (text.length <= length) return text;
  return text.slice(0, text.indexOf(' ', length)) + '...';
}

export const GetGuestRate: FC = () => {
  const { sessionId } = useGenres();
  const [guestRate, setGuestRate] = useState<FilmType[]>([]);
  const { genres } = useGenres();
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);

  const handleRateChange = (filmId: number, value: number) => {
    const options = {
      method: value === 0 ? 'DELETE' : 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGFlNWZiMmJmMThhZDM3YzM2MDU4ZDM4ZjAwNTYxYiIsIm5iZiI6MTczMjcxMDUwMS4zOTEsInN1YiI6IjY3NDcxMDY1MjljYTBlZWEzMDUwNzdkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cEK91n3NznOxH2QoYFzzvhCSepkfderr5bVzjh3KsBU',
        ...(value !== 0 ? { body: JSON.stringify({ value }) } : null),
      },
    };

    fetch(`https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${sessionId}`, options)
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => <Alert message={err} />);

    setRatings((prev) => ({
      ...prev,
      [filmId]: value,
    }));

    MyRateMovie(targetPage);
  };

  const MyRateMovie = async (pages: number) => {
    if (!sessionId) {
      console.error('sessionId отсутствует.');
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGFlNWZiMmJmMThhZDM3YzM2MDU4ZDM4ZjAwNTYxYiIsIm5iZiI6MTczMjcxMDUwMS4zOTEsInN1YiI6IjY3NDcxMDY1MjljYTBlZWEzMDUwNzdkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cEK91n3NznOxH2QoYFzzvhCSepkfderr5bVzjh3KsBU',
      },
    };

    try {
      setSearchLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?language=en-US&page=${pages}&sort_by=created_at.asc`,
        options
      );
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const films = await response.json();

      setSearchLoading(false);
      setGuestRate(films.results);
      setPages(films.total_results);
    } catch (error) {
      console.error('Ошибка при получении рейтинга:', error);
    }
  };

  useEffect(() => {
    MyRateMovie(targetPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratings]);

  const handleToPage = (page: number) => {
    setTargetPage(page);
    MyRateMovie(page);
  };

  if (guestRate.length === 0) {
    return <Alert message={'нет данных. так как гостевая сессия не загрузилась'} />;
  }

  const myRatesFilms = guestRate.map((film) => {
    const filmGenres = film.genre_ids.map((id) => genres.find((genre) => genre.id === id)?.name).filter((name) => name);

    return (
      <>
        <div className={styles.filmConteiner} key={film.id}>
          <img className={styles.poster_path} src={`${urlImageMovie}${film.poster_path}`} alt={film.title} />
          <div className={styles.aboutFilm}>
            <div className={classNames(styles.title_popularity)}>
              <p className={classNames(styles.title)}>{film.title}</p>
              <p
                className={classNames(
                  styles.popularity,
                  { [styles.popularityFrom0To3]: 0 <= film.vote_average && film.vote_average < 3 },
                  { [styles.popularityFrom3To5]: 3 <= film.vote_average && film.vote_average < 5 },
                  { [styles.popularityFrom5To7]: 5 <= film.vote_average && film.vote_average < 7 },
                  { [styles.popularityFrom7]: 7 <= film.vote_average }
                )}
              >
                {film.vote_average.toFixed(1)}
              </p>
            </div>
            <p className={classNames(styles.release_date)}>
              {film.release_date ? format(new Date(film.release_date), 'MMMM dd, yyyy') : 'Дата не указана'}
            </p>
            <div className={styles.genresContainer}>
              {filmGenres.map((genre) => (
                <span key={genre} className={classNames(styles.genreTag)}>
                  {genre}
                </span>
              ))}
            </div>
            <p className={classNames(styles.overview)}>{miniOverview(film.overview)}</p>

            <Rate
              style={{ fontSize: 15 }}
              count={10}
              allowHalf
              value={film.rating}
              onChange={(value) => handleRateChange(film.id, value)}
            />
          </div>
        </div>
      </>
    );
  });

  return (
    <>
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
        <div className={styles.filmCatalog}>
          {guestRate.length > 0 ? myRatesFilms : <Alert message="Фильм не найден" />}
        </div>
        {searchLoading ? <Spin /> : null}
        {myRatesFilms.length === 0 ? null : (
          <Pagination
            current={targetPage}
            onChange={handleToPage}
            defaultPageSize={20}
            align="center"
            showSizeChanger={false}
            defaultCurrent={1}
            total={pages}
          />
        )}
      </ConfigProvider>
    </>
  );
};
