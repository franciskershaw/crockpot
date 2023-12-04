import './styles.scss';

type IconProps = {
	type?: 'primary' | 'secondary' | 'tertiary';
	size?: 'sm' | 'md' | 'lg' | 'xl';
	active?: boolean;
	bgTransparent?: boolean;
	border?: boolean;
	borderWhite?: boolean;
	children: React.ReactNode;
};

const Icon = ({
	type,
	size,
	active,
	bgTransparent,
	border,
	borderWhite,
	children,
}: IconProps) => {
	const iconClasses = `icon icon--${type || 'primary'} icon--${size || 'md'} ${
		border ? 'icon--border' : ''
	} animate`;

	return <div className={iconClasses}>{children}</div>;
};

export default Icon;
