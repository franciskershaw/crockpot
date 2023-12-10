import React from 'react';
import InputGroup from '../InputGroup/InputGroup';

interface TextInputProps {
	id: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	label: string;
}

const TextInput: React.FC<TextInputProps> = ({
	id,
	placeholder = '',
	value,
	onChange,
	label,
}) => {
	return (
		<InputGroup label={label} htmlFor={id}>
			<input
				type='text'
				id={id}
				className='border p-2 rounded-lg text-sm'
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</InputGroup>
	);
};

export default TextInput;
