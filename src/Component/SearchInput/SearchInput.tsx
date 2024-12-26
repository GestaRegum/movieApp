import React, { FC } from 'react';
import { useSearchQuery } from '../../Utils/hooks';
import styles from './SearchInput.module.css';
import classNames from 'classnames';

export const SearchInput: FC = () => {
  const { handleChange, query } = useSearchQuery();
  return (
    <input
      className={classNames(styles)}
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Type to search..."
    />
  );
};
