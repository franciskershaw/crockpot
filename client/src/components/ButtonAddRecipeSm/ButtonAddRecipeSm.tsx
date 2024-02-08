'use client';

import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import { usePathname } from 'next/navigation';

import useUser from '@/src/hooks/auth/useUser';

import AddRecipe from '@/src/components/AddRecipe/AddRecipe';
import Icon from '@/src/components/Icon/Icon';
import Modal from '@/src/components/Modal/Modal';

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
					<Icon size="xl" type="secondary" border>
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
