import { MouseEvent } from 'react';
import Button from '../Button/Button';
import { AiFillHeart } from 'react-icons/ai';
import useFavourites from '@/src/hooks/users/useFavourites';

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
			border
			onClick={handleToggleFavourite}
			inverse={isFav ? true : false}
			hoverOff
		>
			<AiFillHeart />
		</Button>
	);
};

export default ButtonFav;
