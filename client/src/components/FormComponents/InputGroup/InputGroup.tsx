import React, { ReactNode } from 'react';

interface InputGroupProps {
	label?: string;
	htmlFor?: string;
	children: ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({
	label,
	htmlFor,
	children,
}) => {
	return (
		<div className="flex flex-col">
			{label && <label htmlFor={htmlFor}>{label}</label>}
			{children}
		</div>
	);
};

export default InputGroup;
