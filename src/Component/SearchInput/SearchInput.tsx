import { FC, ChangeEvent, useCallback } from 'react';

interface SearchProps {
  onSearch: (text: string) => void;
}

const SearchMenu: FC<SearchProps> = ({ onSearch }) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    },
    [onSearch]
  );

  return <input type="text" onChange={handleChange} placeholder="Введите текст поиска" />;
};

export { SearchMenu };
