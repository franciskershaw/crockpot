import React from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import Button from '@/src/components/Button/Button';
import InputGroup from '@/src/components/FormComponents/InputGroup/InputGroup';

interface QuantityInputProps {
	value: number;
	setValue: React.Dispatch<React.SetStateAction<number>>;
	min?: number;
	max?: number;
	step?: number;
	onChange?: (value: number) => void;
	id?: string;
	label?: string;
}

const QuantityInput = ({
	value,
	setValue,
	min = 0,
	max = 100,
	step = 1,
	onChange,
	id,
	label,
}: QuantityInputProps) => {
	const handleDecrease = () => {
		const newValue = Math.max(min, value - step);
		setValue(newValue);
		if (onChange) onChange(newValue);
	};

	const handleIncrease = () => {
		const newValue = Math.min(max, value + step);
		setValue(newValue);
		if (onChange) onChange(newValue);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputVal = event.target.value;

		if (isNaN(parseInt(inputVal, 10)) || inputVal === '') {
			setValue(min);
			if (onChange) onChange(min);
			return;
		}

		const newValue = parseInt(inputVal, 10);
		const clampedValue = Math.max(min, Math.min(max, newValue));
		setValue(clampedValue);
		if (onChange) onChange(clampedValue);
	};

	return (
		<InputGroup label={label}>
			<div className="flex outline outline-primary -outline-offset-1 w-fit rounded-full bg-white-input">
				<Button onClick={handleDecrease} type="primary">
					<AiOutlineMinus />
				</Button>
				<input
					className="text-center w-[40px] bg-transparent border-0 focus-visible:outline-none"
					type="number"
					value={value}
					onChange={handleChange}
					id={id}
				/>
				<Button onClick={handleIncrease} type="primary">
					<AiOutlinePlus />
				</Button>
			</div>
		</InputGroup>
	);
};

export default QuantityInput;
