'use client';

import React from 'react';

import NavbarSharedLinks from '../NavbarSharedLinks/NavbarSharedLinks';

const NavbarBottom = () => {
	return (
		<nav className="bg-primary border-t border-white container py-5 fixed bottom-0 left-0 z-navBottom shadow-navBottom flex justify-center md:hidden">
			<NavbarSharedLinks />
		</nav>
	);
};

export default NavbarBottom;
