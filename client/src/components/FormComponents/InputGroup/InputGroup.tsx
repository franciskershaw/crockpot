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
		<div className='flex flex-col mb-4'>
			{label && (
				<label htmlFor={htmlFor} className='mb-2 text-sm font-medium'>
					{label}
				</label>
			)}
			{children}
		</div>
	);
};

export default InputGroup;
