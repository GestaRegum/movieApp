import React, { createContext, useContext, useEffect, useState, FC } from 'react';
import { optionsForAPI } from '../../OptionsForAPI';

interface State {
  id: number;
  name: string;
}

interface Props {
  genres: State[];
}

const GenresContext = createContext<Props | undefined>(undefined);

const GenresProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [genres, setGenres] = useState<State[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', optionsForAPI);
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return <GenresContext.Provider value={{ genres }}>{children}</GenresContext.Provider>;
};

const useGenres = () => {
  const context = useContext(GenresContext);
  if (context) return context;
  throw Error;
};

// eslint-disable-next-line react-refresh/only-export-components
export { GenresProvider, useGenres };
