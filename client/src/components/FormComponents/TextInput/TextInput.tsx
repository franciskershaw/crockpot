import React from 'react';

import InputGroup from '../InputGroup/InputGroup';

interface TextInputProps {
	id: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	label?: string;
	error?: string;
	labelOnLeft?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
	id,
	placeholder = '',
	value,
	onChange,
	label,
	error = '',
	labelOnLeft,
}) => {
	return (
		<InputGroup label={label} htmlFor={id} labelOnLeft={labelOnLeft}>
			<input
				type="text"
				id={id}
				className=""
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			{error && <p className="error">{error}</p>}
		</InputGroup>
	);
};

export default TextInput;
