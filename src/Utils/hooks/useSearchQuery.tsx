import React, { createContext, useContext, useState, ChangeEvent, useCallback, ReactNode } from 'react';

interface SearchContextType {
  query: string;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>('');

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return <SearchContext.Provider value={{ query, handleChange }}>{children}</SearchContext.Provider>;
};

export const useSearchQuery = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('Ошибка контекста строки поиска');
  return context;
};
