'use client';

import { usePathname } from 'next/navigation';

import useUser from '@/hooks/auth/useUser';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';

import Modal from '../Modal/Modal';
import OpenModal from '../Modal/OpenModal';

function ButtonAddRecipeLg() {
	const { user } = useUser();

	const pathname = usePathname();

	if (!user || pathname === '/admin') {
		return null;
	}

	return (
		<>
			<OpenModal name="AddRecipe" styles="hidden lg:block">
				<Button text="Add Recipe" type="primary" border />
			</OpenModal>
		</>
	);
}
export default ButtonAddRecipeLg;
