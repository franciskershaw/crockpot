'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import { usePathname } from 'next/navigation';

import useUser from '@/hooks/auth/useUser';

import Icon from '@/components/Icon/Icon';
import Modal from '@/components/Modal/Modal';

import AddRecipe from '../AddRecipe/AddRecipe';

function ButtonAddRecipe() {
	const { user } = useUser();
	const [modalOpen, setModalOpen] = useState(false);

	const pathname = usePathname();

	if (!user || pathname === '/admin') {
		return null;
	}

	return (
		<Modal
			trigger={
				<div className="z-addRecipe fixed m-4 right-0 bottom-[85px] md:bottom-0 cursor-pointer lg:hidden">
					<Icon size="xl" type="primary" border>
						<AiOutlinePlus />
					</Icon>
				</div>
			}
			title="Add New Recipe"
			open={modalOpen}
			setOpen={setModalOpen}
			paddingOn
			size="md"
		>
			<AddRecipe setModal={setModalOpen} />
		</Modal>
	);
}
export default ButtonAddRecipe;
