import './styles.scss';

type IconProps = {
	type?: 'primary' | 'secondary' | 'tertiary' | 'disabled';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	active?: boolean;
	inverse?: boolean;
	border?: boolean;
	children: React.ReactNode;
};

const Icon = ({ type, size, active, border, inverse, children }: IconProps) => {
	const iconClasses = `icon ${type ? `icon--${type}` : ''} icon--${size || 'md'}
  ${border ? 'icon--border' : ''} ${inverse ? 'icon--inverse' : ''} ${active ? 'icon--active' : ''}`;

	return <div className={iconClasses}>{children}</div>;
};

export default Icon;
