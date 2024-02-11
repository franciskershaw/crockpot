'use client';

import { useState } from 'react';

import { usePathname } from 'next/navigation';

import useUser from '@/hooks/auth/useUser';

import AddRecipe from '@/components/AddRecipe/AddRecipe';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';

function ButtonAddRecipeLg() {
	const { user } = useUser();
	const [modalOpen, setModalOpen] = useState(false);

	const pathname = usePathname();

	if (!user || pathname === '/admin') {
		return null;
	}

	return (
		<Modal
			trigger={
				<div className="hidden lg:block">
					<Button text="Add Recipe" type="primary" border />
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
export default ButtonAddRecipeLg;
