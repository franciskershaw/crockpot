// TODO - Decide on styling, add disabled prop to - button on 0

import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import Button from '../Button/Button';
import './styles.scss';

type QuantityInputProps = {
	initialValue: number;
	min?: number;
	max?: number;
	onChange?: (value: number) => void;
};

const QuantityInput = ({
	initialValue,
	min = 0,
	max = 100,
	onChange,
}: QuantityInputProps) => {
	const [quantity, setQuantity] = useState(initialValue);

	const handleDecrease = () => {
		const newValue = Math.max(min, quantity - 1);
		setQuantity(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	const handleIncrease = () => {
		const newValue = Math.min(max, quantity + 1);
		setQuantity(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(event.target.value, 10);
		const clampedValue = Math.max(min, Math.min(max, newValue));
		setQuantity(clampedValue);
		if (onChange) {
			onChange(clampedValue);
		}
	};

	return (
		<div className="flex border-2 border-black w-fit rounded-full bg-white">
			<Button inverse type="secondary" onClick={handleDecrease}>
				<AiOutlineMinus />
			</Button>
			<input
				className="text-center w-[50px] bg-transparent"
				type="number"
				value={quantity}
				onChange={handleChange}
			/>
			<Button inverse type="secondary" onClick={handleIncrease}>
				<AiOutlinePlus />
			</Button>
		</div>
	);
};

export default QuantityInput;
