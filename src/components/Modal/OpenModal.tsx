import { FC, ReactNode } from 'react';

import { useModal } from './ModalContext';

interface OpenModalProps {
	name: string;
	children: ReactNode;
	styles?: string;
	onClick?: () => void;
}

const OpenModal: FC<OpenModalProps> = ({ name, styles, children, onClick }) => {
	const { openModal } = useModal();

	return (
		<div
			className={styles || ''}
			onClick={() => {
				openModal(name);
				if (onClick) onClick();
			}}
		>
			{children}
		</div>
	);
};

export default OpenModal;
