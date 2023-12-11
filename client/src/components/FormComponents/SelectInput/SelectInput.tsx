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
		let newValues: string[] = [];

		if (Array.isArray(selectedOptions)) {
			newValues = selectedOptions.map((option) => option.value);
		} else if (selectedOptions && !Array.isArray(selectedOptions)) {
			newValues = [(selectedOptions as Option).value];
		}

		onChange(newValues);
	};

	return (
		<InputGroup label={label} htmlFor={id}>
			<Select
				options={options}
				isMulti={isMulti}
				onChange={handleMultiSelectChange}
				value={selectedOptions}
				placeholder={placeholder}
			/>
		</InputGroup>
	);
};

export default SelectInput;
