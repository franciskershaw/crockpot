import React from 'react';

interface TextInputProps {
	id: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
	id,
	placeholder = '',
	value,
	onChange,
}) => {
	return (
		<input
			type='text'
			id={id}
			className='border p-2 rounded-lg text-sm'
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
};

export default TextInput;
