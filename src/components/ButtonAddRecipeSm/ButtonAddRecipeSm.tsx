'use client';

import { AiOutlinePlus } from 'react-icons/ai';

import { usePathname } from 'next/navigation';

import useUser from '@/hooks/auth/useUser';

import Icon from '@/components/Icon/Icon';

import AddRecipe from '../AddRecipe/AddRecipe';
import Modal from '../Modal/Modal';
import OpenModal from '../Modal/OpenModal';

function ButtonAddRecipe() {
	const { user } = useUser();

	const pathname = usePathname();

	if (!user || pathname === '/admin') {
		return null;
	}

	return (
		<>
			<OpenModal
				styles="z-addRecipe fixed m-4 right-0 bottom-[85px] md:bottom-0 cursor-pointer lg:hidden"
				name="AddRecipe"
			>
				<Icon size="xl" type="primary" border>
					<AiOutlinePlus />
				</Icon>
			</OpenModal>
			<Modal name="AddRecipe" title="Add new recipe">
				<AddRecipe />
			</Modal>
		</>
	);
}
export default ButtonAddRecipe;
