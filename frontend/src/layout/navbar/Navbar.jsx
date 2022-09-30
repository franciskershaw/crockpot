import { Link } from 'react-router-dom';
import Icon from '../../components/global/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faMagnifyingGlass, faBook, faUtensils} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Add recipe"}>
          <FontAwesomeIcon icon={faPlus}/>
        </Icon>
      </Link>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Browse"}>
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </Icon>
      </Link>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Cookbook"}>
          <FontAwesomeIcon icon={faBook}/>
        </Icon>
      </Link>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Menu"}>
          <FontAwesomeIcon icon={faUtensils}/>
        </Icon>
      </Link>
    </nav>
  )
}

export default Navbar