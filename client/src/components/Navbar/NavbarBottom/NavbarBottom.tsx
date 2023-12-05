'use client';

import React from 'react';
import NavbarSharedLinks from '../NavbarSharedLinks/NavbarSharedLinks';

const NavbarBottom = () => {
	return (
		<nav className="p-4 border-t border-black shadow-navBottom bg-white fixed bottom-0 left-0 w-full flex justify-evenly z-navBottom md:hidden">
			<NavbarSharedLinks />
		</nav>
	);
};

export default NavbarBottom;
