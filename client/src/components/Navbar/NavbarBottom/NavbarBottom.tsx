'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Button from '../../Button/Button';
import NavbarSharedLinks from '../NavbarSharedLinks/NavbarSharedLinks';
import useUser from '@/src/hooks/auth/useUser';

const NavbarBottom = () => {
	return (
		<nav className="p-4 border-t border-white shadow-navBottom bg-primary fixed bottom-0 left-0 w-full flex justify-evenly z-navBottom md:hidden">
			<NavbarSharedLinks />
		</nav>
	);
};

export default NavbarBottom;
