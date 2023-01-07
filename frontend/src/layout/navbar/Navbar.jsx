import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/icons/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlus,
	faMagnifyingGlass,
	faBook,
	faUtensils,
	faArrowRightFromBracket,
	faArrowRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../hooks/auth/useUser';
import { useAuth } from '../../hooks/auth/useAuth';

const Navbar = () => {
	const navigate = useNavigate();
	const { user } = useUser();
	const { signout } = useAuth();

	const onLogout = () => {
		signout();
		return navigate('/browse');
	};

	const [activeLink, setActiveLink] = useState('');
	const location = useLocation();

	useEffect(() => {
		setActiveLink(location.pathname);
		console.log(location);
	}, [location]);

	return (
		<>
			<nav className="navbar">
				<div className="navbar__wrapper container">
					<div className="font-logo text-h1 text-black hidden md:block w-full text-center mb-2 lg:mb-0 lg:mr-auto lg:text-left lg:w-auto">
						crockpot
					</div>
					{user?.isAdmin && (
						<Link className="w-1/4 md:w-auto" to={'addrecipe'}>
							<Icon
								text={'Add recipe'}
								outline
								state={activeLink === '/addrecipe' ? 'active' : ''}
							>
								<FontAwesomeIcon icon={faPlus} />
							</Icon>
						</Link>
					)}
					<Link className="w-1/4 md:w-auto" to={'browse'}>
						<Icon
							text={'Browse'}
							outline
							state={activeLink === '/browse' ? 'active' : ''}
						>
							<FontAwesomeIcon icon={faMagnifyingGlass} />
						</Icon>
					</Link>
					<Link className="w-1/4 md:w-auto" to={'cookbook'}>
						<Icon
							text={'Cookbook'}
							outline
							state={activeLink === '/cookbook' ? 'active' : ''}
						>
							<FontAwesomeIcon icon={faBook} />
						</Icon>
					</Link>
					<Link className="w-1/4 md:w-auto" to={'menu'}>
						<Icon
							text={'Menu'}
							outline
							state={activeLink === '/menu' ? 'active' : ''}
						>
							<FontAwesomeIcon icon={faUtensils} />
						</Icon>
					</Link>
					<div className="hidden md:block">
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
			</nav>
		</>
	);
};

export default Navbar;
