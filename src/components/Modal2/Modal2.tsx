import { FC, ReactNode, useEffect } from 'react';
import { GrClose } from 'react-icons/gr';

import { useModal } from './ModalContext';

interface ModalProps {
	name: string; // MUST BE UNIQUE
	title?: string | JSX.Element;
	children: ReactNode;
	// customSize?: 'small' | 'medium' | 'large'; // for tablet size and higher
}

const Modal2: FC<ModalProps> = ({ name, title, children }) => {
	const { openModals, closeModal } = useModal();
	const isOpen = openModals.includes(name);

	if (!isOpen) return null;

	const contentStyles =
		'relative bg-white rounded-xl shadow-lg transition-all duration-300 overflow-auto h-[95vh] w-full max-w-[90vh]';

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300"
				onClick={() => closeModal(name)}
			></div>
			<div className={contentStyles}>
				<div className="flex justify-between items-center bg-primary text-white px-3 py-2 sticky top-0 z-10">
					{title && (
						<div className="text-lg md:text-xl md:py-2 capitalize">{title}</div>
					)}
					<button
						aria-label="close"
						className="p-2"
						onClick={() => closeModal(name)}
					>
						<GrClose className="text-white" />
					</button>
				</div>
				<div className="mt-4 p-4">{children}</div>
			</div>
		</div>
	);
};

export default Modal2;
