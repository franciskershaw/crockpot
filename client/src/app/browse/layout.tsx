// import type { Metadata } from 'next';
import { BrowsePageProvider } from './context/BrowsePageContext';

// export const metadata: Metadata = {
// 	title: 'Crockpot',
// 	description: 'Generated by create next app',
// };

export default function BrowsePageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <BrowsePageProvider>{children}</BrowsePageProvider>;
}