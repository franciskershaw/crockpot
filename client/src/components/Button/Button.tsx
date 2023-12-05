'use client';

import React from 'react';
import './styles.scss';
import Icon from '../Icon/Icon';

interface ButtonProps {
	type?: 'primary' | 'secondary' | 'tertiary';
	border?: boolean;
	inverse?: boolean;
	hoverOff?: boolean;
	onClick?: (e: React.MouseEvent<HTMLElement>) => void;
	text?: string;
	ariaLabel?: string;
	children?: React.ReactNode;
	iconSmall?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			type,
			inverse,
			border,
			hoverOff,
			onClick,
			text,
			ariaLabel,
			children,
			iconSmall,
		},
		ref,
	) => {
		const buttonClasses = `btn btn--${type || 'primary'} ${
			border ? 'btn--border' : ''
		} ${hoverOff ? 'btn--no-hover' : ''} ${inverse ? 'btn--inverse ' : ''} ${
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
				{children && <Icon size={iconSmall ? 'sm' : 'md'}>{children}</Icon>}
			</button>
		);
	},
);

export default Button;
