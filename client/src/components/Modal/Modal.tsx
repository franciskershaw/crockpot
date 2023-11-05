'use client';

import * as Dialog from '@radix-ui/react-dialog';
import './styles.scss';
import Button from '../Button/Button';
import { GrClose } from 'react-icons/gr';

interface ModalProps {
  title: string | JSX.Element;
  trigger: JSX.Element;
  isWide?: boolean;
  paddingOff?: boolean;
  children: JSX.Element;
}

const Modal: React.FC<ModalProps> = ({
  title,
  trigger,
  isWide,
  paddingOff,
  children,
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          className={`DialogContent relative ${
            isWide && 'DialogContent--is-wide'
          }`}>
          <div className="flex justify-between items-center bg-green-400 p-2 sticky top-0 left-0 z-10">
            <Dialog.Title className="DialogTitle">{title}</Dialog.Title>
            <div>
              <Dialog.Close asChild>
                <Button
                  border
                  onClick={() => console.log('Hello!')}
                  ariaLabel="Close">
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
