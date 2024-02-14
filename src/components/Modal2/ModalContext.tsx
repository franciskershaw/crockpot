import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

interface ModalContextType {
	openModals: string[];
	openModal: (name: string) => void;
	closeModal: (name: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [openModals, setOpenModals] = useState<string[]>([]);

	const openModal = (name: string) => {
		setOpenModals((prev) => [...prev, name]);
	};

	const closeModal = (name: string) => {
		setOpenModals((prev) => prev.filter((modalName) => modalName !== name));
	};

	useEffect(() => {
		if (openModals.length > 0) {
			// Disable scroll when any modal is open
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable scroll when all modals are closed
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [openModals]);

	return (
		<ModalContext.Provider value={{ openModals, openModal, closeModal }}>
			{children}
		</ModalContext.Provider>
	);
};

export const useModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('useModal must be used within a ModalProvider');
	}
	return context;
};
