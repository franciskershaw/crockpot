import { MouseEvent, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { RiShoppingBasketLine } from 'react-icons/ri';

import { Recipe } from '@/src/types/types';

import useRecipeMenu from '@/src/app/your-crockpot/hooks/useRecipeMenu';

import Button from '@/src/components/Button/Button';

import './styles.scss';

type IsMenu = {
	_id: string;
	serves: number;
};

type ButtonCartProps = {
	recipe: Recipe;
	initialValue?: number;
	min?: number;
	max?: number;
	onChange?: (value: number) => void;
	isMenu: IsMenu;
};

const ButtonCart = ({
	recipe,
	initialValue = 4,
	min = 0,
	max = 50,
	onChange,
	isMenu,
}: ButtonCartProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [quantity, setQuantity] = useState(
		isMenu ? isMenu.serves : initialValue,
	);

	const { updateRecipeMenu } = useRecipeMenu();

	const updateQuantity = (newQuantity: number) => {
		if (newQuantity !== quantity) {
			setQuantity(newQuantity);
			if (onChange) {
				onChange(newQuantity);
			}
		}
	};

	const handleDecrease = () => {
		updateQuantity(Math.max(min, quantity - 1));
	};

	const handleIncrease = () => {
		updateQuantity(Math.min(max, quantity + 1));
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(event.target.value, 10);
		if (!isNaN(newValue)) {
			updateQuantity(Math.max(min, Math.min(max, newValue)));
		}
	};

	const handleUpdateRecipeMenu = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if ((!isMenu && quantity > 0) || (isMenu && isMenu.serves < quantity)) {
			updateRecipeMenu({
				recipeId: recipe._id,
				serves: quantity,
				type: 'add',
			});
		} else if (isMenu && (quantity < isMenu.serves || quantity === 0)) {
			updateRecipeMenu({
				recipeId: recipe._id,
				serves: quantity,
				type: 'remove',
			});
		}
		setIsExpanded(false);
	};

	// TODO: Make global number component with confirm dropdown

	return (
		<div className="relative">
			<div className="flex items-center border-2 border-black bg-white rounded-full w-fit">
				<div className="relative">
					<div
						className={`absolute opacity-100 cursor-pointer fade ${
							isExpanded ? '!opacity-0 z-back' : ''
						}`}
					>
						<div className="relative">
							<Button
								onClick={(e: MouseEvent<HTMLElement>) => {
									e.stopPropagation();
									setIsExpanded(true);
								}}
								type="primary"
								inverse={isMenu ? true : false}
							>
								<RiShoppingBasketLine />
							</Button>
							{isMenu && (
								<div className="absolute top-[-5px] right-[-5px] h-5 w-5 rounded-full bg-black border border-body-light flex items-center justify-center">
									<span className="text-xs text-white">{isMenu.serves}</span>
								</div>
							)}
						</div>
					</div>
					<div>
						<Button
							onClick={(e: MouseEvent<HTMLElement>) => {
								e.stopPropagation();
								handleDecrease();
							}}
							inverse
						>
							<AiOutlineMinus />
						</Button>
					</div>
				</div>

				<div
					className={`quantity-input-container ${
						isExpanded ? 'quantity-input-container--expanded' : ''
					}`}
				>
					<input
						type="number"
						value={quantity}
						min={min}
						max={max}
						onChange={handleChange}
					/>
					<Button
						onClick={(e: MouseEvent<HTMLElement>) => {
							e.stopPropagation();
							handleIncrease();
						}}
						inverse
					>
						<AiOutlinePlus />
					</Button>
				</div>
			</div>
			{isExpanded && (
				<h6 onClick={handleUpdateRecipeMenu} className="quantity-input-confirm">
					{!isMenu
						? quantity > 0
							? 'Add to cart'
							: 'Cancel'
						: quantity > 0
							? 'Update quantity'
							: 'Remove quantity'}
				</h6>
			)}
		</div>
	);
};

export default ButtonCart;
