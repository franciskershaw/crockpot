'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NavbarSharedLinks from '../NavbarSharedLinks/NavbarSharedLinks';
import Button from '../../Button/Button';
import { usePathname } from 'next/navigation';
import './styles.scss';
import useUser from '@/src/hooks/auth/useUser';
import useAuth from '@/src/hooks/auth/useAuth';

const NavbarTop = () => {
	const pathname = usePathname();

	const [isOpen, setIsOpen] = useState(false);

	const { user } = useUser();
	const { logout } = useAuth();

	const toggleMenu = () => {
		setIsOpen((prev) => !prev);
	};

	const handleLogout = () => {
		logout();
		toggleMenu();
	};

	return (
		<nav className="nav py-5 bg-primary border-b border-white fixed top-0 left-0 w-full flex justify-evenly z-navTop shadow-navTop">
			<div className="container flex justify-between items-center w-full">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center space-x-2">
						<div className="animate animate--grow cursor-pointer">
							<span className="h1 bg-primary text-body-light border-4 border-body-light rounded-full px-3 py-2">
								Crockpot
							</span>
						</div>
						<div className="hidden md:flex items-center space-x-2">
							<NavbarSharedLinks />
						</div>
					</div>
					<div className="hidden md:flex items-center space-x-2">
						<Link href="/login">
							<Button text="Login" onClick={toggleMenu} />
						</Link>
					</div>
				</div>
				{/* On mobile devices, display hamburger menu */}
				<div className="md:hidden">
					<button
						className={`nav__hamburger z-navHamburger ${
							isOpen ? 'nav__hamburger--open' : ''
						}`}
						onClick={toggleMenu}
						aria-label="Menu"
					>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</button>
				</div>
			</div>
			{/* Mobile menu items */}
			<div
				className={`bg-primary flex flex-col items-center justify-center space-y-4 nav__menu animate z-navMenu ${
					isOpen ? 'nav__menu--open' : ''
				} `}
			>
				<Link href="/sandbox">
					<Button text="Sandbox" borderWhite onClick={toggleMenu} />
				</Link>
				{user ? (
					<Button text="Logout" borderWhite onClick={handleLogout} />
				) : (
					<>
						<Link href="/login">
							<Button text="Login" borderWhite onClick={toggleMenu} />
						</Link>
						<Link href="/register">
							<Button text="Register" borderWhite onClick={toggleMenu} />
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default NavbarTop;
