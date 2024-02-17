import { FC, ReactNode } from 'react';
import { GrClose } from 'react-icons/gr';

import { useModal } from './ModalContext';

interface ModalProps {
	name: string; // MUST BE UNIQUE
	title?: string | JSX.Element;
	children: ReactNode;
	customSize?: 'small' | 'medium' | 'large';
	onClose?: () => void;
}

const Modal: FC<ModalProps> = ({
	name,
	title,
	children,
	customSize,
	onClose,
}) => {
	const { openModals, closeModal } = useModal();
	const isOpen = openModals.includes(name);

	if (!isOpen) return null;

	const contentStyles = `bg-primary-light mt-2 relative bg-white rounded-xl shadow-lg transition-all duration-300 overflow-auto ${customSize === 'small' ? 'w-full sm:w-2/3 md:w-1/2 lg:w-1/3' : 'max-h-[90vh] w-full max-w-[90vh]'} `;
	const titleStyles = `flex items-center px-3 py-2 sticky top-0 z-10 ${title ? 'justify-between bg-primary text-white' : 'justify-end'} `;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300"
				onClick={() => {
					if (onClose) onClose();
					closeModal(name);
				}}
			></div>
			<div className={contentStyles}>
				<div className={titleStyles}>
					{title && (
						<div className="text-lg md:text-xl md:py-2 capitalize">{title}</div>
					)}
					<button
						aria-label="close"
						onClick={() => closeModal(name)}
						className="cursor-pointer"
					>
						<GrClose
							className={`h-5 w-5 md:h-6 md:w-6 ${title ? 'text-white' : 'text-base'}`}
						/>
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
