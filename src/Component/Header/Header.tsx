import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import classNames from 'classnames';

export const Header = () => {
  return (
    <nav className={classNames(styles)}>
      <div>
        <Link to="/">Search</Link>
      </div>
      <div>
        <Link to="/rates">Rates</Link>
      </div>
    </nav>
  );
};
