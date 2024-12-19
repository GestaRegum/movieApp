import React, { createContext, useContext, useEffect, useState, FC } from 'react';
import { optionsApiForGet } from '../../OptionsForAPI';

const urlGenres = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

interface State {
  id: number;
  name: string;
}

interface Props {
  genres: State[];
  sessionId: string | null;
  setSessionId: (id: string) => void;
}

const Context = createContext<Props | undefined>(undefined);

const GenresProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [genres, setGenres] = useState<State[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  const fetchGenres = async () => {
    try {
      const response = await fetch(urlGenres, optionsApiForGet);
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('ошибка загрузки:', error);
    }
  };
  useEffect(() => {
    fetchGenres();
  }, []);

  return <Context.Provider value={{ genres, sessionId, setSessionId }}>{children}</Context.Provider>;
};

const useGenres = () => {
  const context = useContext(Context);
  if (context) return context;
  throw Error;
};

// eslint-disable-next-line react-refresh/only-export-components
export { GenresProvider, useGenres };
