import './styles.scss';

type IconProps = {
	type?: 'primary' | 'secondary' | 'tertiary';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	active?: boolean;
	border?: boolean;
	children: React.ReactNode;
};

const Icon = ({ type, size, active, border, children }: IconProps) => {
	const iconClasses = `icon ${type ? `icon--${type}` : ''} icon--${size || 'md'}
  ${border ? 'icon--border' : ''} ${active ? 'icon--active' : ''}`;

	return <div className={iconClasses}>{children}</div>;
};

export default Icon;
