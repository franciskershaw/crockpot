import { Link } from 'react-router-dom';
import Icon from '../../components/global/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'

const Header = ({ title, children }) => {
  return (
    <header className="header">
      <div className="container flex justify-between items-center">
        <div className="header__left flex items-center">
          <h1 className="text-h3">{title}</h1>
          {children}
        </div>
        <div className="header__right">
          <Link to={'/login'}>
            <Icon text={"Log in"}>
              <FontAwesomeIcon icon={faArrowRightFromBracket}/>
            </Icon>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
