
import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import {
  optionsApiForGet,
  urlForGenres,
} from '../../Utils/MyApiForFetchingDifferentDataAboutMoviesFromServer/urlAndOptions';

interface Genre {
  id: number;
  name: string;
}

interface GenresContextType {
  genres: Genre[];
  fetchGenres: () => void; // Добавляем метод для принудительной загрузки данных
}

interface Props {
  children: ReactNode;
}

const GenresContext = createContext<GenresContextType | undefined>(undefined);

export const GenresProvider: FC<Props> = ({ children }) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  const fetchGenres = async () => {
    try {
      const response = await fetch(urlForGenres, optionsApiForGet);
      const data = await response.json();
      setGenres(data.genres);
      localStorage.setItem('genres', JSON.stringify(data.genres));
    } catch (error) {
      console.error('ошибка загрузки:', error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return <GenresContext.Provider value={{ genres, fetchGenres }}>{children}</GenresContext.Provider>;
};

export const useGenres = (): GenresContextType => {
  const context = useContext(GenresContext);
  if (!context) {
    throw new Error('useGenres must be used within a GenresProvider');
  }

  return context;
};
