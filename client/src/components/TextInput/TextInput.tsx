import React from 'react';

interface TextInputProps {
	id: string;
	label: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
	id,
	label,
	placeholder = '',
	value,
	onChange,
}) => {
	return (
		<div className='flex flex-col'>
			<label htmlFor={id} className='mb-2 text-sm font-medium'>
				{label}
			</label>
			<input
				type='text'
				id={id}
				className='border p-2 rounded-lg text-sm'
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

export default TextInput;
