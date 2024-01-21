'use client';

import { GrClose } from 'react-icons/gr';

import * as Dialog from '@radix-ui/react-dialog';

import Button from '@/src/components/Button/Button';

import './styles.scss';

interface ModalProps {
	title: string | JSX.Element;
	trigger: JSX.Element;
	children: JSX.Element;
	open?: boolean;
	nested?: boolean;
	setOpen?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
	title,
	trigger,
	children,
	open,
	nested,
	setOpen,
}) => {
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay
					className={`DialogOverlay ${nested && 'DialogOverlay--nested'}`}
				/>
				<Dialog.Content
					className={`DialogContent relative ${nested && 'DialogContent--nested'}`}
				>
					<div className="flex justify-between items-center bg-white border border-black-25 px-3 py-2 sticky top-0 left-0 z-modalHeader">
						<Dialog.Title className="DialogTitle truncate">
							{title}
						</Dialog.Title>
						<div>
							<Dialog.Close asChild>
								<Button ariaLabel="Close">
									<GrClose />
								</Button>
							</Dialog.Close>
						</div>
					</div>
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default Modal;
