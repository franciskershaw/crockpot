'use client';

import { usePathname } from 'next/navigation';

import useUser from '@/hooks/auth/useUser';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';

import Modal2 from '../Modal2/Modal2';
import OpenModal from '../Modal2/OpenModal';

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
			<Modal2 name={'AddRecipe'} title="Add new recipe">
				<AddRecipe />
			</Modal2>
		</>
	);
}
export default ButtonAddRecipeLg;
