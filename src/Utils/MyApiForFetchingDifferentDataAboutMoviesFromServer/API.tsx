import React from 'react';
import { Alert } from 'antd';
import {
  optionsApiForGet,
  optionsForRating,
  urlForMyRateMovie,
  urlForRating,
  urlForSearchMovie,
} from './urlAndOptions';

export const fetchRatedMovies = async (sessionId: string | null, page: number) => {
  if (!sessionId) return <Alert message="сессия не найдена" />;

  const response = await fetch(urlForMyRateMovie(sessionId, page), optionsApiForGet);

  if (!response.ok) {
    return <Alert message={`Ошибка: ${response.status}`} />;
  }

  return response.json();
};

export const rateMovie = async (movieId: number, sessionId: string | null, value: number) => {
  if (!sessionId) return <Alert message="сессия не найдена" />;

  const response = await fetch(urlForRating(movieId, sessionId), optionsForRating(value));

  if (!response.ok) {
    return <Alert message={`Ошибка: ${response.status}`} />;
  }

  return response.json();
};

export const searchMovies = async (query: string, page: number) => {
  const response = await fetch(urlForSearchMovie(query, page), optionsApiForGet);

  if (!response.ok) {
    throw new Error(`Ошибка при поиске фильмов: ${response.status}`);
  }

  return response.json();
};
