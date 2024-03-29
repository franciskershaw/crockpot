'use client';

import { MouseEvent, ReactNode, forwardRef } from 'react';

import Icon from '@/components/Icon/Icon';

import './styles.scss';

interface ButtonProps {
	type?: 'primary' | 'secondary' | 'tertiary' | 'disabled';
	border?: boolean;
	inverse?: boolean;
	hoverOff?: boolean;
	onClick?: (e: MouseEvent<HTMLElement>) => void;
	text?: string;
	ariaLabel?: string;
	children?: ReactNode;
	iconXs?: boolean;
	disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
			iconXs,
			disabled,
		},
		ref,
	) => {
		const buttonClasses = `btn btn--${type || 'primary'} ${
			border ? 'btn--border' : ''
		} ${hoverOff ? 'btn--no-hover' : ''} ${inverse ? 'btn--inverse ' : ''} ${
			text ? 'min-w-[140px]' : ''
		} animate animate--grow`;

		return (
			<button
				ref={ref}
				className={buttonClasses}
				onClick={onClick}
				aria-label={ariaLabel ?? text}
				disabled={disabled}
			>
				{text && <span className="w-full p-1">{text}</span>}
				{children && <Icon size={iconXs ? 'xs' : 'md'}>{children}</Icon>}
			</button>
		);
	},
);

Button.displayName = 'Button';

export default Button;
