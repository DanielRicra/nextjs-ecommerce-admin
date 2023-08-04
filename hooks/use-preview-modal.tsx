import { create } from "zustand";

import { ProductData } from "@/types";

interface PreviewModal {
	isOpen: boolean;
	data?: ProductData;
	onOpen: (data: ProductData) => void;
	onClose: () => void;
}

const usePreviewModal = create<PreviewModal>((set) => ({
	isOpen: false,
	data: undefined,
	onOpen: (data: ProductData) => set({ isOpen: true, data }),
	onClose: () => set({ isOpen: false, data: undefined }),
}));

export default usePreviewModal;
