import { FC } from 'react';

import InputGroup from '../InputGroup/InputGroup';

interface TextInputProps {
	id: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	label?: string;
	error?: string;
	labelOnLeft?: boolean;
	isPassword?: boolean;
}

const TextInput: FC<TextInputProps> = ({
	id,
	placeholder = '',
	value,
	onChange,
	label,
	error = '',
	labelOnLeft,
	isPassword = false,
}) => {
	return (
		<InputGroup label={label} htmlFor={id} labelOnLeft={labelOnLeft}>
			<input
				type={isPassword ? 'password' : 'text'}
				id={id}
				name={id}
				className=""
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				autoComplete="off"
			/>
			{error && <p className="error">{error}</p>}
		</InputGroup>
	);
};

export default TextInput;
