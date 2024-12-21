import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FilmType, SearchType } from 'type';
import { Spin, Pagination, Rate, Alert, ConfigProvider } from 'antd';
import { useDebouncedCallback } from 'use-debounce';
import { useGenres } from '../Context';
import { optionsApiForGet } from '../../OptionsForAPI';
import classNames from 'classnames';

import styles from './FilmCatalog.module.css';

const urlMovie = 'https://api.themoviedb.org/3/search/movie';
const urlImageMovie = 'https://image.tmdb.org/t/p/original/';

function miniOverview(text: string, length = 60): string {
  if (text.length <= length) return text;
  return text.slice(0, text.indexOf(' ', length)) + '...';
}



const FilmCatalog: FC<SearchType> = ({ query }) => {
  const { genres } = useGenres();
  const [films, setFilms] = useState<FilmType[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(1);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [hasFilms, setHasFilms] = useState<boolean>(true);
  const sessionId = sessionStorage.getItem('sessionId');

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

  const fetchFilms = useDebouncedCallback((query: string, cur: number) => {
    if (query === '') {
      setPages(1);
      setFilms([]);
      setTargetPage(1);
      setSearchLoading(false);
      return;
    }

    setFilms([]);
    setSearchLoading(true);

    fetch(`${urlMovie}?query=${query}&page=${cur}`, optionsApiForGet)
      .then((res) => res.json())
      .then((film) => {
        if (film.total_results === 0) {
          setPages(1);
          setFilms([]);
          setSearchLoading(false);
          setHasFilms(false);
          return;
        }
        setHasFilms(true);
        setPages(film.total_results);
        setFilms(film.results);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке фильмов:', err);
        setSearchLoading(false);
      });
  }, 2000);

  useEffect(() => {
    fetchFilms(query, targetPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, targetPage, fetchFilms]);

  const handleRateChange = (filmId: number, value: number) => {
    const options = {
      method: value === 0 ? 'DELETE' : 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OGFlNWZiMmJmMThhZDM3YzM2MDU4ZDM4ZjAwNTYxYiIsIm5iZiI6MTczMjcxMDUwMS4zOTEsInN1YiI6IjY3NDcxMDY1MjljYTBlZWEzMDUwNzdkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cEK91n3NznOxH2QoYFzzvhCSepkfderr5bVzjh3KsBU',
      },

      ...(value !== 0 ? { body: JSON.stringify({ value }) } : null),
    };

    fetch(`https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${sessionId}`, options)
      .then((res) => res.json())
      .catch((err) => console.error(err));

    setRatings((prev) => {
      const updatedRatings = { ...prev };

      if (value === 0) {
        delete updatedRatings[filmId];
      } else {
        updatedRatings[filmId] = value;
      }

      localStorage.setItem('ratings', JSON.stringify(updatedRatings));

      return updatedRatings;
    });
  };

  const handleToPage = (page: number) => {
    setTargetPage(page);
    fetchFilms(query, page);
  };

  const filmCatalog = films.map((film) => {
    const filmGenres = film.genre_ids.map((id) => genres.find((genre) => genre.id === id)?.name).filter((name) => name);
    return (
      <div className={classNames(styles.filmConteiner)} key={film.id}>
        <img className={classNames(styles.poster_path)} src={`${urlImageMovie}${film.poster_path}`} alt={film.title} />
        <div className={classNames(styles.aboutFilm)}>
          <div className={classNames(styles.title_popularity)}>
            <p className={classNames(styles.title)}>{film.title}</p>
            <p
              className={classNames(
                styles.popularity,
                { [styles.popularityFrom7]: 7 <= film.vote_average },
                { [styles.popularityFrom5To7]: 5 <= film.vote_average },
                { [styles.popularityFrom3To5]: 3 <= film.vote_average },
                { [styles.popularityFrom0To3]: 0 <= film.vote_average }
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
          <div className={classNames(styles.rate)}>
            <Rate
              className={classNames(styles.customRate)}
              count={10}
              allowHalf
              value={ratings[film.id] || 0}
              onChange={(value) => handleRateChange(film.id, value)}
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {!hasFilms ? <Alert message="Такой фильм еще не сняли :(" /> : null}
      <div className={styles.filmCatalog}>{hasFilms ? filmCatalog : null}</div>

      {searchLoading ? <Spin size="large" /> : null}

      {filmCatalog.length === 0 ? null : (
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
            align="center"
            showSizeChanger={false}
            defaultCurrent={1}
            total={pages}
          />
        </ConfigProvider>
      )}
    </>
  );
};

export { FilmCatalog };
