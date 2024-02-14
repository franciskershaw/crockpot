'use client';

import { FC, useState } from 'react';

import Link from 'next/link';

import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/auth/useUser';

import Button from '@/components/Button/Button';
import NavbarSharedLinks from '@/components/Navbar/NavbarSharedLinks/NavbarSharedLinks';

import './styles.scss';

type NavbarSharedLinksHamburgerProps = {
	handleLogout: () => void;
	setIsOpen: (isOpen: boolean) => void;
};

const NavbarTop = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { user } = useUser();
	const { logout } = useAuth();

	const toggleMenu = () => {
		setIsOpen((prev) => !prev);
	};

	const handleLogout = () => {
		setIsOpen(false);
		logout();
	};

	const NavbarSharedLinksHamburger: FC<NavbarSharedLinksHamburgerProps> = ({
		handleLogout,
		setIsOpen,
	}) => {
		return (
			<>
				{user?.isAdmin && (
					<Link onClick={() => setIsOpen(false)} href="/admin">
						<Button text="Admin" type="primary" border />
					</Link>
				)}
				{user ? (
					<Button text="Logout" onClick={handleLogout} type="primary" border />
				) : (
					<Link onClick={() => setIsOpen(false)} href="/">
						<Button text="Login" type="primary" border />
					</Link>
				)}
			</>
		);
	};

	return (
		<nav className="bg-primary border-b border-white py-5 fixed top-0 left-0 right-0 z-navTop shadow-navTop ">
			<div className="container flex items-center">
				<div className="mr-4">
					<span className="h1 bg-primary text-white border-4 border-white rounded-full px-3 py-2">
						Crockpot
					</span>
				</div>
				<div className="hidden md:flex">
					<NavbarSharedLinks />
				</div>
				{/* Hamburger icon on mobile */}
				<div className="ml-auto md:hidden">
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
				{/* Login/logout on desktop */}
				<div className="ml-auto hidden md:flex md:space-x-3 lg:space-x-4">
					<NavbarSharedLinksHamburger
						handleLogout={handleLogout}
						setIsOpen={setIsOpen}
					/>
				</div>
				<div
					className={`md:hidden nav__menu bg-primary border-l border-background-main flex flex-col items-center justify-center space-y-4 animate z-navMenu ${
						isOpen ? 'nav__menu--open' : ''
					} `}
				>
					<NavbarSharedLinksHamburger
						handleLogout={handleLogout}
						setIsOpen={setIsOpen}
					/>
				</div>
			</div>
		</nav>
	);
};

export default NavbarTop;
