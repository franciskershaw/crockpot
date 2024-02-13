'use client';

import { GrClose } from 'react-icons/gr';

import * as Dialog from '@radix-ui/react-dialog';

import Button from '@/src/components/Button/Button';

import './styles.scss';

interface ModalProps {
	title: string | JSX.Element;
	trigger: JSX.Element;
	children: JSX.Element;
	nested?: boolean;
	paddingOn?: boolean;
	size?: 'sm' | 'md';
	open?: boolean;
	setOpen?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
	title,
	trigger,
	children,
	nested,
	paddingOn,
	size,
	open,
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
					className={`DialogContent relative ${nested ? 'DialogContent--nested' : null} ${size === 'sm' ? 'DialogContent--sm' : null} ${size === 'md' ? 'DialogContent--md' : null}`}
				>
					<div className="flex justify-between items-center bg-primary text-white px-3 py-2 sticky top-0 left-0 z-modalHeader">
						<Dialog.Title className="DialogTitle truncate capitalize pr-0.5">
							{title}
						</Dialog.Title>
						<div>
							<Dialog.Close asChild>
								<Button ariaLabel="Close" type="primary">
									<GrClose />
								</Button>
							</Dialog.Close>
						</div>
					</div>
					<div className={`${paddingOn ? 'p-3' : ''}`}>{children}</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default Modal;
