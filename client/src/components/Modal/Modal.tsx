'use client';

import { GrClose } from 'react-icons/gr';

import * as Dialog from '@radix-ui/react-dialog';

import './styles.scss';

import Button from '../Button/Button';

interface ModalProps {
	title: string | JSX.Element;
	trigger: JSX.Element;
	isWide?: boolean;
	paddingOff?: boolean;
	children: JSX.Element;
	open?: boolean;
	setOpen?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
	title,
	trigger,
	isWide,
	paddingOff,
	children,
	open,
	setOpen,
}) => {
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay" />
				<Dialog.Content
					className={`DialogContent relative ${
						isWide && 'DialogContent--is-wide'
					}`}
				>
					<div className="flex justify-between items-center bg-white border border-black-25 px-3 py-2 sticky top-0 left-0 z-modalHeader">
						<Dialog.Title className="DialogTitle">{title}</Dialog.Title>
						<div>
							<Dialog.Close asChild>
								<Button ariaLabel="Close">
									<GrClose />
								</Button>
							</Dialog.Close>
						</div>
					</div>
					<div className={`${!paddingOff ? 'p-4' : ''}`}>{children}</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default Modal;
