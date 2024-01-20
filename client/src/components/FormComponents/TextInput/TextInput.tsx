import React from 'react';

import InputGroup from '../InputGroup/InputGroup';

interface TextInputProps {
	id: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	label?: string;
	error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
	id,
	placeholder = '',
	value,
	onChange,
	label,
	error = '',
}) => {
	return (
		<InputGroup label={label} htmlFor={id}>
			<input
				type="text"
				id={id}
				className="border p-2 rounded-lg text-sm"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			{error && <p className="pt-2 text-error text-xs">{error}</p>}
		</InputGroup>
	);
};

export default TextInput;
