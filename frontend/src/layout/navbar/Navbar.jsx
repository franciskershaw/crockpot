import { Link } from 'react-router-dom';
import Icon from '../../components/icons/Icon'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faMagnifyingGlass, faBook, faUtensils} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
    <nav className='navbar lg:hidden'>
      <Link className="w-1/4" to={'addrecipe'}>
        <Icon text={"Add recipe"} outline>
          <FontAwesomeIcon icon={faPlus}/>
        </Icon>
      </Link>
      <Link className="w-1/4" to={'browse'}>
        <Icon text={"Browse"} outline>
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </Icon>
      </Link>
      <Link className="w-1/4" to={'cookbook'}>
        <Icon text={"Cookbook"} outline>
          <FontAwesomeIcon icon={faBook}/>
        </Icon>
      </Link>
      <Link className="w-1/4" to={'menu'}>
        <Icon text={"Menu"} outline>
          <FontAwesomeIcon icon={faUtensils}/>
        </Icon>
      </Link>
    </nav>
  )
}

export default Navbar