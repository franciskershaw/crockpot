import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Crockpot - Your Crockpot',
};

export default function YourCrockpotPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
