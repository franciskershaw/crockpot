import React from 'react';

import type { Metadata } from 'next';

import ButtonAddRecipe from '@/src/components/ButtonAddRecipe/ButtonAddRecipe';
import NavbarBottom from '@/src/components/Navbar/NavbarBottom/NavbarBottom';
import NavbarTop from '@/src/components/Navbar/NavbarTop/NavbarTop';
import Providers from '@/src/providers/Providers';
import '@/src/styles/globals.scss';

export const metadata: Metadata = {
	title: 'Crockpot',
	description: 'Generated by create next app',
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
					{/* <NavbarTop /> */}
					<main className="">{children}</main>
					{/* <ButtonAddRecipe /> */}
					{/* <NavbarBottom /> */}
				</Providers>
			</body>
		</html>
	);
}
