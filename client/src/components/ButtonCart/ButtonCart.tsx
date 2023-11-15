import { useState, MouseEvent } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { RiShoppingBasketLine } from 'react-icons/ri';
import Button from '../Button/Button';
import './styles.scss';

type IsMenu = {
	_id: string;
	serves: number;
};

type ButtonCartProps = {
	recipeId: string;
	initialValue?: number;
	min?: number;
	max?: number;
	onChange?: (value: number) => void;
	isMenu: IsMenu;
};

const ButtonCart = ({
	recipeId,
	initialValue = 4,
	min = 0,
	max = 50,
	onChange,
	isMenu,
}: ButtonCartProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [quantity, setQuantity] = useState(initialValue);

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

	return (
		<div className="relative">
			<div className="flex items-center border-2 border-black bg-white rounded-full w-fit">
				<div className="relative">
					<div
						className={`absolute opacity-100 cursor-pointer fade ${
							isExpanded ? '!opacity-0 -z-10' : ''
						}`}
					>
						<div className="relative">
							{isMenu && (
								<div className="absolute top-[-5px] right-[-5px] h-5 w-5 rounded-full bg-white border-2 border-black flex items-center justify-center">
									<span className="text-xs">{isMenu.serves}</span>
								</div>
							)}
							<Button
								hoverOff
								onClick={(e: MouseEvent<HTMLElement>) => {
									e.stopPropagation();
									setIsExpanded(true);
								}}
								inverse={isMenu ? true : false}
							>
								<RiShoppingBasketLine />
							</Button>
						</div>
					</div>
					<div>
						<Button
							onClick={(e: MouseEvent<HTMLElement>) => {
								e.stopPropagation();
								handleDecrease();
							}}
							inverse
							hoverOff
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
						hoverOff
					>
						<AiOutlinePlus />
					</Button>
				</div>
			</div>
			{isExpanded && (
				<h5
					onClick={(e: MouseEvent<HTMLDivElement>) => {
						e.stopPropagation();
						setIsExpanded(false);
					}}
					className="absolute bottom-[-20px] w-[134px] text-center underline cursor-pointer bg-black/40 text-white rounded-full"
				>
					{quantity > 0 ? 'Update basket' : 'Remove from basket'}
				</h5>
			)}
		</div>
	);
};

export default ButtonCart;
