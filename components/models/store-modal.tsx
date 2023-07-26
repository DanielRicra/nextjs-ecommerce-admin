"use client";

import Modal from "@/components/ui/modal";
import useStoreModal from "@/hooks/use-store-modal";

export const StoreModal = () => {
	const storeModal = useStoreModal();
	return (
		<Modal
			title="Create store"
			description="Create a new store"
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			Create store form
		</Modal>
	);
};
