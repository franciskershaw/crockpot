import React from 'react';

import { Capriola, Open_Sans } from 'next/font/google';

import Providers from '@/providers/Providers';
import type { Metadata } from 'next';

import ButtonAddRecipeSm from '@/components/ButtonAddRecipeSm/ButtonAddRecipeSm';
import NavbarBottom from '@/components/Navbar/NavbarBottom/NavbarBottom';
import NavbarTop from '@/components/Navbar/NavbarTop/NavbarTop';

import '@/styles/globals.scss';

const openSans = Open_Sans({
	weight: ['300', '400'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-opensans',
});

const capriola = Capriola({
	weight: '400',
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-capriola',
});

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
		<html lang="en" className={`${capriola.variable} ${openSans.variable}`}>
			<body>
				<Providers>
					<NavbarTop />
					<main className="mt-[74px] mb-[101px] md:mt-[83px] md:mb-4">
						{children}
					</main>
					<ButtonAddRecipeSm />
					<NavbarBottom />
				</Providers>
			</body>
		</html>
	);
}
