import React, { FC } from 'react';
import InputGroup from '../InputGroup/InputGroup';
import Select, { SingleValue, MultiValue } from 'react-select';

interface Option {
	value: string;
	label: string;
}

interface SelectInputProps {
	id: string;
	options: Option[];
	value: string[];
	onChange: (value: string[]) => void;
	label: string;
	isMulti?: boolean;
	placeholder: string;
}

const SelectInput: FC<SelectInputProps> = ({
	id,
	options,
	value,
	onChange,
	label,
	isMulti = false,
	placeholder = 'Please select',
}) => {
	const selectedOptions = options.filter((option) =>
		value.includes(option.value),
	);

	const handleMultiSelectChange = (
		selectedOptions: MultiValue<Option> | SingleValue<Option>,
	) => {
		const newValues = Array.isArray(selectedOptions)
			? selectedOptions.map((option) => option.value)
			: [(selectedOptions as Option).value];
		onChange(newValues);
	};

	const isOptionDisabled = () => value.length >= 3;

	return (
		<InputGroup label={label} htmlFor={id}>
			<Select
				options={options}
				isMulti={isMulti}
				onChange={handleMultiSelectChange}
				value={selectedOptions}
				placeholder={placeholder}
				isOptionDisabled={isOptionDisabled}
			/>
		</InputGroup>
	);
};

export default SelectInput;
