import './styles.scss';

type IconProps = {
	type?: 'primary' | 'secondary' | 'tertiary';
	size?: 'sm' | 'md' | 'lg' | 'xl';
	active?: boolean;
	bgTransparent?: boolean;
	borderColour?: boolean;
	borderWhite?: boolean;
	children: React.ReactNode;
};

const Icon = ({
	type,
	size,
	active,
	bgTransparent,
	borderColour,
	borderWhite,
	children,
}: IconProps) => {
	const iconClasses = `icon icon--${type || 'primary'} icon--${size || 'md'} ${
		bgTransparent ? 'icon--bg-transparent' : ''
	}
  ${borderWhite ? 'icon--border-white' : ''} ${
		borderColour ? 'icon--border-colour' : ''
	} ${active ? 'icon--active' : ''} animate`;

	return <div className={iconClasses}>{children}</div>;
};

export default Icon;
