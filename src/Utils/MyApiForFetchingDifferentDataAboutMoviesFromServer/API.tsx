import React from 'react';
import { Alert } from 'antd';
import {
  optionsApiForGet,
  optionsForRating,
  urlForMyRateMovie,
  urlForRating,
  urlForSearchMovie,
} from './urlAndOptions';

const sessionId = sessionStorage.getItem('sessionId');

export const fetchRatedMovies = async (page: number) => {
  if (!sessionId) return <Alert message="сессия не найдена" />;

  const response = await fetch(urlForMyRateMovie(sessionId, page), optionsApiForGet);

  if (!response.ok) {
    return <Alert message={`Ошибка: ${response.status}`} />;
  }

  return response.json();
};

export const rateMovie = async (movieId: number, value: number) => {
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
