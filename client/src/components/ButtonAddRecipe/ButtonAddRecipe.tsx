'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import Icon from '../Icon/Icon';
import Modal from '../Modal/Modal';
import AddRecipe from '../AddRecipe/AddRecipe';

function ButtonAddRecipe() {
	const handlePress = () => {
		console.log('Hello!');
	};

	return (
		<Modal
			trigger={
				<button
					className='btn btn--primary btn--border fixed bottom-20 md:bottom-0 right-0 z-10 m-4'
					onClick={handlePress}
					aria-label='Add Recipe'
				>
					<Icon size='xl'>
						<AiOutlinePlus />
					</Icon>
				</button>
			}
			title='Add new recipe'
		>
			<AddRecipe />
		</Modal>
	);
}
export default ButtonAddRecipe;
