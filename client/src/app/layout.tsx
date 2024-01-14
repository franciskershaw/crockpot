import '../styles/globals.scss';
import type { Metadata } from 'next';
import NavbarTop from '../components/Navbar/NavbarTop/NavbarTop';
import NavbarBottom from '../components/Navbar/NavbarBottom/NavbarBottom';
import ButtonAddRecipe from '../components/ButtonAddRecipe/ButtonAddRecipe';
import Providers from '../providers/Providers';

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
		<html lang='en'>
			<body>
				<Providers>
					<NavbarTop />
					<main className='mt-[73px] mb-24 md:mt-28 md:mb-8'>{children}</main>
					<ButtonAddRecipe />
					<NavbarBottom />
				</Providers>
			</body>
		</html>
	);
}
