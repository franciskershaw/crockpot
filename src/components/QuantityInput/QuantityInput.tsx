import React from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import Button from '@/components/Button/Button';
import InputGroup from '@/components/FormComponents/InputGroup/InputGroup';

interface QuantityInputProps {
	value: number;
	setValue: React.Dispatch<React.SetStateAction<number>>;
	min?: number;
	max?: number;
	onChange?: (value: number) => void;
	id?: string;
	label?: string;
}

const QuantityInput = ({
	value,
	setValue,
	min = 0,
	max = 100,
	onChange,
	id,
	label,
}: QuantityInputProps) => {
	const handleDecrease = () => {
		const newValue = Math.max(min, value - 1);
		setValue(newValue);
		if (onChange) onChange(newValue);
	};

	const handleIncrease = () => {
		const newValue = Math.min(max, value + 1);
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
			<div className="flex outline outline-2 outline-black -outline-offset-2 w-fit rounded-full bg-white">
				<Button inverse onClick={handleDecrease}>
					<AiOutlineMinus />
				</Button>
				<input
					className="text-center w-[40px] bg-transparent border-0 focus-visible:outline-none"
					type="number"
					value={value}
					onChange={handleChange}
					id={id}
				/>
				<Button inverse onClick={handleIncrease}>
					<AiOutlinePlus />
				</Button>
			</div>
		</InputGroup>
	);
};

export default QuantityInput;
