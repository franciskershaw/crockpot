import { FC, ReactNode } from 'react';

import { useModal } from './ModalContext';

interface OpenModalProps {
	name: string;
	children: ReactNode;
	styles?: string;
}

const OpenModal: FC<OpenModalProps> = ({ name, styles, children }) => {
	const { openModal } = useModal();

	return (
		<div className={styles || ''} onClick={() => openModal(name)}>
			{children}
		</div>
	);
};

export default OpenModal;
