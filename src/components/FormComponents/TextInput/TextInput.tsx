import { ChangeEvent, FC } from 'react';

import InputGroup from '../InputGroup/InputGroup';

interface TextInputProps {
	id: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
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
	const isClient = !!onChange;
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e.target.value);
		}
	};
	return (
		<InputGroup label={label} htmlFor={id} labelOnLeft={labelOnLeft}>
			{isClient ? (
				<input
					type={isPassword ? 'password' : 'text'}
					id={id}
					name={id}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					autoComplete="off"
				/>
			) : (
				<input
					type={isPassword ? 'password' : 'text'}
					id={id}
					name={id}
					placeholder={placeholder}
					autoComplete="off"
				/>
			)}

			{error && <p className="error">{error}</p>}
		</InputGroup>
	);
};

export default TextInput;
