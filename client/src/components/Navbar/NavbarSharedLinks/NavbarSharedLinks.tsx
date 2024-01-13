'use client';

import React from 'react';

import Link from 'next/link';

import useUser from '@/src/hooks/auth/useUser';

import Button from '../../Button/Button';

const NavbarSharedLinks = () => {
	const { user } = useUser();
	return (
		<div className="flex space-x-12 md:space-x-4">
			<Link href="/browse">
				<Button text="Browse Recipes" type="primary" border />
			</Link>
			{user && (
				<Link href="/your-crockpot">
					<Button text="Your Crockpot" type="primary" border />
				</Link>
			)}
		</div>
	);
};

export default NavbarSharedLinks;
