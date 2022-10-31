// Header component
  // (Optional) first child - appears before title (eg. icon)
  // Title prop
  // (Optional) second child - appears below title (eg. user and time on ViewRecipe page)

import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../hooks/auth/useUser';
import { useAuth } from '../../hooks/auth/useAuth';

const Header = ({ title, children }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signout } = useAuth();

  const onLogout = () => {
    signout();
    return navigate('/browse');
  };

  let preTitle
  let postTitle

  if (children) {
    // If only 1 item set
    preTitle = children
    
    // If 2 items set
    if (children[0]) {
      preTitle = children[0]
    }
    if (children[1]) {
      postTitle = children[1]
    }
  }

  return (
    <header className="header">
      <div className="container flex justify-between items-center">
        <div className="header__left flex flex-col">
          <div className='flex items-center'>
            {preTitle}
            <h1 className="h3">{title}</h1>
          </div>
          {postTitle}
        </div>
        <div className="header__right">
          {user ? (
            <div onClick={onLogout} className="cursor-pointer">
              <Icon text={'Log out'} outline>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </Icon>
            </div>
          ) : (
            <Link to={'/login'}>
              <Icon text={'Log in'} outline>
                <FontAwesomeIcon icon={faArrowRightToBracket} />
              </Icon>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
