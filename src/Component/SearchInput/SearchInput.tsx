import { FC, ChangeEvent, useCallback } from 'react';

import styles from './SearchInput.module.css';
import classNames from 'classnames';

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

  return <input className={classNames(styles)} type="text" onChange={handleChange} placeholder="Type to search..." />;
};

export { SearchMenu };
