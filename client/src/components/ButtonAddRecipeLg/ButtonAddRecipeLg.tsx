'use client';

import { useState } from 'react';

import { usePathname } from 'next/navigation';

import useUser from '@/src/hooks/auth/useUser';

import AddRecipe from '@/src/components/AddRecipe/AddRecipe';
import Button from '@/src/components/Button/Button';
import Modal from '@/src/components/Modal/Modal';

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
