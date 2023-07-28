"use client";

import useStoreModal from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetUpPage = () => {
	const onOpen = useStoreModal((state) => state.onOpen);
	const isOpen = useStoreModal((state) => state.isOpen);

	useEffect(() => {
		if (!isOpen) {
			onOpen();
		}
	}, [isOpen, onOpen]);

	// We don't have to return anything because only we are using this page to trigger the modal
	return null;
};

export default SetUpPage;
