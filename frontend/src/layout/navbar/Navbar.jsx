import { Link } from 'react-router-dom';
import Icon from '../../components/global/icons/Icon'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Add recipe"}/>
      </Link>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Browse"}/>
      </Link>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Cookbook"}/>
      </Link>
      <Link className="w-1/4" to={'register'}>
        <Icon text={"Menu"}/>
      </Link>
    </nav>
  )
}

export default Navbar