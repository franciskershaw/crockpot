import React from 'react';

import Providers from '@/src/providers/Providers';
import type { Metadata } from 'next';

import ButtonAddRecipeSm from '@/src/components/ButtonAddRecipeSm/ButtonAddRecipeSm';
import NavbarBottom from '@/src/components/Navbar/NavbarBottom/NavbarBottom';
import NavbarTop from '@/src/components/Navbar/NavbarTop/NavbarTop';

import '@/src/styles/globals.scss';

export const metadata: Metadata = {
	title: 'Crockpot',
	description:
		'Discover your next favorite meal! Explore easy-to-follow recipes and generate personalized shopping lists with ease. Perfect for busy foodies and home cooks looking for inspiration and efficiency in the kitchen. Start your culinary journey here!',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<NavbarTop />
					<main className="mt-[74px] mb-[101px] md:mt-[85px] md:mb-4">
						{children}
					</main>
					<ButtonAddRecipeSm />
					<NavbarBottom />
				</Providers>
			</body>
		</html>
	);
}
