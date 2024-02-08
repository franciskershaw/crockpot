import { MouseEvent } from 'react';
import { AiFillHeart } from 'react-icons/ai';

import useFavourites from '@/src/hooks/users/useFavourites';

import Button from '@/src/components/Button/Button';

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
			onClick={handleToggleFavourite}
			type={isFav ? 'secondary' : 'tertiary'}
			inverse={isFav ? false : true}
			border={isFav ? false : true}
			hoverOff
		>
			<AiFillHeart />
		</Button>
	);
};

export default ButtonFav;
