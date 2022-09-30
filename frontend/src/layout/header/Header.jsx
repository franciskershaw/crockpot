import { Link } from 'react-router-dom';
import Icon from '../../components/global/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className='header'>
      <div className="container flex justify-between items-center">
        <div className="header__left">
          <h1 className="text-h3">Title</h1>
        </div>
        <div className="header__right">
          <Link to={'login'}>
            <Icon text={"Log in"}>
              <FontAwesomeIcon icon={faArrowRightFromBracket}/>
            </Icon>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header