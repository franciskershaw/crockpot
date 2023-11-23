'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import Icon from '../Icon/Icon';

function ButtonAddRecipe() {
	const handlePress = () => {
		console.log('Hello!');
	};

	return (
		<div className='hidden md:block'>
			<button
				className='btn btn--primary btn--border fixed bottom-0 right-0 z-10 m-4'
				onClick={handlePress}
				aria-label='Add Recipe'
			>
				<Icon size='xl'>
					<AiOutlinePlus />
				</Icon>
			</button>
		</div>
	);
}
export default ButtonAddRecipe;
