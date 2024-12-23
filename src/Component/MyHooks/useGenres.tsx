/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { optionsApiForGet, urlForGenres } from '../WorkWithAPI/urlAndOptions';

const useGenres = () => {
  const Genres = async () => {
    try {
      const response = await fetch(urlForGenres, optionsApiForGet);
      const data = await response.json();
      localStorage.setItem('genres', JSON.stringify(data.genres));
    } catch (error) {
      console.error('ошибка загрузки:', error);
    }
  };

  useEffect(() => {
    Genres();
  }, []);
};

// eslint-disable-next-line react-refresh/only-export-components
export { useGenres };
