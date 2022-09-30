import { Link } from 'react-router-dom';
import Icon from '../../components/global/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMagnifyingGlass,
  faBook,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';

const Header = ({ title }) => {
  return (
    <header className="header">
      <div className="container flex justify-between items-center">
        <div className="header__left">
          <h1 className="header__title">{title}</h1>
        </div>
        <div className="header__right">
          <Link to={'register'}>
            <Icon>
              <FontAwesomeIcon icon={faPlus} />
            </Icon>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
