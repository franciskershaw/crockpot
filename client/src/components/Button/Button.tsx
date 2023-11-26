'use client';

import React from 'react';
import './styles.scss';
import Icon from '../Icon/Icon';

interface ButtonProps {
	type?: 'primary' | 'secondary' | 'tertiary';
	inverse?: boolean;
	borderColour?: boolean;
	borderWhite?: boolean;
	hoverOff?: boolean;
	onClick?: (e: React.MouseEvent<HTMLElement>) => void;
	text?: string;
	ariaLabel?: string;
	children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			type,
			inverse,
			borderColour,
			borderWhite,
			hoverOff,
			onClick,
			text,
			ariaLabel,
			children,
		},
		ref,
	) => {
		const buttonClasses = `btn btn--${type || 'primary'} ${
			borderColour ? 'btn--border-colour' : ''
		} ${borderWhite ? 'btn--border-white' : ''} ${
			hoverOff ? 'btn--no-hover' : ''
		} ${inverse ? 'btn--inverse ' : ''} ${
			text ? 'min-w-[125px]' : ''
		} animate animate--grow`;

		return (
			<button
				ref={ref}
				className={buttonClasses}
				onClick={onClick}
				aria-label={ariaLabel ?? text}
			>
				{text && <span className="w-full p-1">{text}</span>}
				{children && <Icon>{children}</Icon>}
			</button>
		);
	},
);

export default Button;
