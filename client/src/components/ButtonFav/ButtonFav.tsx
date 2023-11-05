import { useState, MouseEvent } from 'react';
import Button from '../Button/Button';
import { AiFillHeart } from 'react-icons/ai';

type ButtonFavProps = {
	recipeId: string;
};

const ButtonFav = ({ recipeId }: ButtonFavProps) => {
	return (
		<Button
			border
			onClick={(e: MouseEvent<HTMLElement>) => {
				e.stopPropagation();
				console.log(recipeId);
			}}
		>
			<AiFillHeart />
		</Button>
	);
};

export default ButtonFav;
