"use client";

import * as Dialog from "@radix-ui/react-dialog";
import "./styles.scss";
import Button from "../Button/Button";
import { AiFillFilter } from "react-icons/ai";
import { GrClose } from "react-icons/gr";

const Modal = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button border onClick={() => console.log("Hello!")}>
          <AiFillFilter />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Modal title</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Modal content content content
          </Dialog.Description>
          <div>Other content!</div>
          <div>
            <Dialog.Close asChild>
              <Button
                border
                text="Save changes"
                onClick={() => console.log("Hello!")}
              ></Button>
            </Dialog.Close>
          </div>
          <div className="absolute top-4 right-4">
            <Dialog.Close asChild>
              <Button
                border
                onClick={() => console.log("Hello!")}
                ariaLabel="Close"
              >
                <GrClose />
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
