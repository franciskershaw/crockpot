'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Button from '../../Button/Button';
import NavbarSharedLinks from '../NavbarSharedLinks/NavbarSharedLinks';
import useUser from '@/src/hooks/auth/useUser';

const NavbarBottom = () => {
	const pathname = usePathname();

	const { user } = useUser();

	return (
		<nav className='p-4 border-2 border-black bg-white fixed bottom-0 left-0 w-full flex justify-evenly md:hidden'>
			{user && (
				<Link href='/add-recipe'>
					<Button
						border
						inverse={pathname.startsWith('/add-recipe')}
						text='Add Recipe'
					/>
				</Link>
			)}

			<NavbarSharedLinks />
		</nav>
	);
};

export default NavbarBottom;
