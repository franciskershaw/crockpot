'use client';

import React from 'react';

import Link from 'next/link';

import useUser from '@/src/hooks/auth/useUser';

import Button from '@/src/components/Button/Button';
import ButtonAddRecipe from '@/src/components/ButtonAddRecipe/ButtonAddRecipe';

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
			<div className="hidden md:block">
				<ButtonAddRecipe />
			</div>
		</div>
	);
};

export default NavbarSharedLinks;
