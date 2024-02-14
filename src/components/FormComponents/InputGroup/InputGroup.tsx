import { FC, ReactNode } from 'react';

interface InputGroupProps {
	label?: string;
	htmlFor?: string;
	children: ReactNode;
	labelOnLeft?: boolean;
}

const InputGroup: FC<InputGroupProps> = ({
	label,
	htmlFor,
	children,
	labelOnLeft,
}) => {
	return (
		<div
			className={`flex ${!labelOnLeft ? 'flex-col' : 'flex-grow items-center'}`}
		>
			{label && (
				<label
					htmlFor={htmlFor}
					className={`${labelOnLeft ? 'label--on-left' : ''}`}
				>
					{label}
				</label>
			)}
			{children}
		</div>
	);
};

export default InputGroup;
