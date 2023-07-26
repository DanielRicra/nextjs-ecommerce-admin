import { create } from "zustand";

interface UseStoreModalInterface {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useStoreModal = create<UseStoreModalInterface>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useStoreModal;
