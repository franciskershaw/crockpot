import { MouseEvent } from 'react';
import { AiFillHeart } from 'react-icons/ai';

import useFavourites from '@/hooks/users/useFavourites';

import Button from '@/components/Button/Button';

type ButtonFavProps = {
	id: string;
	isFav: boolean;
};

const ButtonFav = ({ id, isFav }: ButtonFavProps) => {
	const { toggleFavourite } = useFavourites();

	const handleToggleFavourite = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		toggleFavourite({ _id: id });
	};

	return (
		<Button
			type="primary"
			onClick={handleToggleFavourite}
			inverse={isFav ? true : false}
			hoverOff
			border
		>
			<AiFillHeart />
		</Button>
	);
};

export default ButtonFav;
