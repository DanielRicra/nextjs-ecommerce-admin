"use client";

import PreviewModal from "@/app/(root)/(routes)/store/component/preview-modal";
import { useEffect, useState } from "react";

const ProductModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<PreviewModal />
		</>
	);
};
export default ProductModalProvider;
