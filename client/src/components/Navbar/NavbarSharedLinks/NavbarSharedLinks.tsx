'use client';

import React from 'react';

import Link from 'next/link';

import useUser from '@/src/hooks/auth/useUser';

import Button from '@/src/components/Button/Button';
import ButtonAddRecipeLg from '@/src/components/ButtonAddRecipeLg/ButtonAddRecipeLg';

const NavbarSharedLinks = () => {
	const { user } = useUser();
	return (
		<div className="flex space-x-12 md:space-x-3 lg:space-x-4">
			<Link href="/browse">
				<Button text="Browse Recipes" type="primary" border />
			</Link>
			{user && (
				<Link href="/your-crockpot">
					<Button text="Your Crockpot" type="primary" border />
				</Link>
			)}
			<ButtonAddRecipeLg />
		</div>
	);
};

export default NavbarSharedLinks;
