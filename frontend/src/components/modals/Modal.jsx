import FocusTrap from "focus-trap-react" // https://www.npmjs.com/package/focus-trap-react
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faXmark} from '@fortawesome/free-solid-svg-icons'

const Modal = ({isModalOpen, setIsModalOpen, heading, children}) => {
    const closeModal = () => {
        document.body.classList.remove("modal-is-open")
        setIsModalOpen(false)
    }

    return (
        <>
            {isModalOpen ? (
                <FocusTrap>
                    <div className="modal">
                        <div onClick={closeModal} className="modal__overlay"></div>
                        <div className="modal__wrapper">
                            <div className="modal__header">
                                <h2 className="leading-9 text-white capitalize">{heading}</h2>
                                <button onClick={closeModal} className="icon icon--secondary icon--outline ">
                                    <FontAwesomeIcon icon={faXmark}/>
                                </button>
                            </div>
                            <div className="modal__content">
                                {children}
                            </div>
                        </div>
                    </div>
                </FocusTrap>
            ) : null }
        </>
    )
}

export default Modal