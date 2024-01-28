import React, { FC } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

import InputGroup from '../InputGroup/InputGroup';

interface Option {
	value: string;
	label: string;
}

interface SelectInputProps {
	id: string;
	options: Option[];
	value: string | string[];
	onChange: (value: string[]) => void;
	label: string;
	isMulti?: boolean;
	placeholder?: string;
	error?: string;
}

const SelectInput: FC<SelectInputProps> = ({
	id,
	options,
	value,
	onChange,
	label,
	isMulti = false,
	placeholder = 'Please select',
	error = '',
}) => {
	const selectedOptions = isMulti
		? options.filter(
				(option) => Array.isArray(value) && value.includes(option.value),
			)
		: options.find((option) => option.value === value);

	const handleChange = (
		selectedOptions: MultiValue<Option> | SingleValue<Option>,
	) => {
		if (isMulti) {
			const newValues = (selectedOptions as MultiValue<Option>).map(
				(option) => option.value,
			);
			onChange(newValues);
		} else {
			const newValue = (selectedOptions as Option).value;
			onChange([newValue]);
		}
	};

	const isOptionDisabled = () =>
		isMulti && Array.isArray(value) && value.length >= 3;

	return (
		<InputGroup label={label} htmlFor={id}>
			<Select
				options={options}
				isMulti={isMulti}
				onChange={handleChange}
				value={selectedOptions}
				placeholder={placeholder}
				isOptionDisabled={isOptionDisabled}
				className="react-select"
				classNamePrefix="react-select"
			/>
			{error && <p className="error">{error}</p>}
		</InputGroup>
	);
};

export default SelectInput;
