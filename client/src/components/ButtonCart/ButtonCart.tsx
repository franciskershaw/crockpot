import { useState } from 'react';
import Icon from '../Icon/Icon';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { RiShoppingBasketLine } from 'react-icons/ri';

type ButtonCartProps = {
	recipeId: string;
	initialValue?: number;
	min?: number;
	max?: number;
	onChange?: (value: number) => void;
};

const ButtonCart = ({
	recipeId,
	initialValue = 4,
	min = 0,
	max = 50,
	onChange,
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
			<div className="flex items-center border-2 border-blue-500 rounded-full overflow-hidden w-fit mb-5">
				<div className="relative">
					<div
						onClick={() => setIsExpanded(true)}
						className={`absolute opacity-100 cursor-pointer fade ${
							isExpanded ? '!opacity-0 -z-10' : ''
						}`}
					>
						<Icon size="lg" type="secondary">
							<RiShoppingBasketLine />
						</Icon>
					</div>
					<div className="cursor-pointer" onClick={handleDecrease}>
						<Icon size="lg" type="secondary" active>
							<AiOutlineMinus />
						</Icon>
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
					<div className="cursor-pointer" onClick={handleIncrease}>
						<Icon size="lg" type="secondary" active>
							<AiOutlinePlus />
						</Icon>
					</div>
				</div>
			</div>
			{isExpanded && (
				<h5
					onClick={() => setIsExpanded(false)}
					className="absolute bottom-[-20px] w-[134px] text-center underline cursor-pointer"
				>
					Remove from basket
				</h5>
			)}
		</div>
	);
};

export default ButtonCart;
