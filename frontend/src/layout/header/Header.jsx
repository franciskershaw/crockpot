import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/global/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../hooks/auth/useUser';
import { useAuth } from '../../hooks/auth/useAuth';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signout } = useAuth();

  const onLogout = () => {
    signout();
    return navigate('/login');
  };

  return (
    <header className="header">
      <div className="container flex justify-between items-center">
        <div className="header__left">
          <h1 className="header__title">{title}</h1>
        </div>
        <div className="header__right">
          {user ? (
            <div onClick={onLogout}>
              <Icon text={'Log out'}>
                <FontAwesomeIcon icon={faArrowRightToBracket} />
              </Icon>
            </div>
          ) : (
            <Link to={'login'}>
              <Icon text={'Log in'}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </Icon>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
