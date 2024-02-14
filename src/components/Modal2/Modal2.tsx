import { FC, ReactNode, useEffect } from 'react';
import { GrClose } from 'react-icons/gr';

import { useModal } from './ModalContext';

interface ModalProps {
	name: string; // MUST BE UNIQUE
	title?: string | JSX.Element;
	children: ReactNode;
	customSize?: 'small' | 'medium' | 'large';
}

const Modal2: FC<ModalProps> = ({ name, title, children, customSize }) => {
	const { openModals, closeModal } = useModal();
	const isOpen = openModals.includes(name);

	if (!isOpen) return null;

	const titleStyles = `flex items-center px-3 py-2 sticky top-0 z-10 ${title ? 'justify-between bg-primary text-white' : 'justify-end'} `;
	const contentStyles = `relative bg-green-200 rounded-xl shadow-lg transition-all duration-300 overflow-auto ${customSize === 'small' ? 'pb-4 max-h-[35vh] w-full sm:w-2/3 md:w-1/2 lg:w-1/3' : 'max-h-[95vh] w-full max-w-[90vh]'} `;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300"
				onClick={() => closeModal(name)}
			></div>
			<div className={contentStyles}>
				<div className={titleStyles}>
					{title && (
						<div className="text-lg md:text-xl md:py-2 capitalize">{title}</div>
					)}
					<button
						aria-label="close"
						className="p-2"
						onClick={() => closeModal(name)}
					>
						<GrClose className={title ? 'text-white' : 'text-base'} />
					</button>
				</div>
				<div className={title ? 'p-4' : ''}>{children}</div>
			</div>
		</div>
	);
};

export default Modal2;
