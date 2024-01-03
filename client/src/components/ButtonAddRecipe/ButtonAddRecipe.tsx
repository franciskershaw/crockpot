'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import Icon from '../Icon/Icon';
import Modal from '../Modal/Modal';
import AddRecipe from '../AddRecipe/AddRecipe';
import { useState } from 'react';
import useUser from '@/src/hooks/auth/useUser';

function ButtonAddRecipe() {
	const { user } = useUser();

	if (!user) {
		return null;
	}

	const [modalOpen, setModalOpen] = useState(false);
	return (
		<Modal
			trigger={
				<button
					className="btn btn--primary btn--border fixed bottom-20 md:bottom-0 right-0 z-10 m-4"
					aria-label="Add Recipe"
				>
					<Icon size="xl">
						<AiOutlinePlus />
					</Icon>
				</button>
			}
			title="Add new recipe"
			open={modalOpen}
			setOpen={setModalOpen}
		>
			<AddRecipe setModal={setModalOpen} />
		</Modal>
	);
}
export default ButtonAddRecipe;
