// React Component, React-related libraries, Context Imports
// Next.js modules
// Hooks
// Shared Components
// Type Imports
// Styles

import React from 'react';

import NavbarTop from '../components/Navbar/NavbarTop/NavbarTop';
import NavbarBottom from '../components/Navbar/NavbarBottom/NavbarBottom';
import ButtonAddRecipe from '../components/ButtonAddRecipe/ButtonAddRecipe';
import Providers from '../providers/Providers';

import type { Metadata } from 'next';

import '../styles/globals.scss';

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
