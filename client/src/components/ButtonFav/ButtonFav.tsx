import { useState, MouseEvent } from 'react';
import Button from '../Button/Button';
import { AiFillHeart } from 'react-icons/ai';

type ButtonFavProps = {
	id: string;
	isFav: boolean;
};

const ButtonFav = ({ id, isFav }: ButtonFavProps) => {
	return (
		<Button
			border
			onClick={(e: MouseEvent<HTMLElement>) => {
				e.stopPropagation();
				console.log(id);
			}}
			inverse={isFav ? true : false}
		>
			<AiFillHeart />
		</Button>
	);
};

export default ButtonFav;
