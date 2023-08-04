"use client";

import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}
const ProductModal: React.FC<ProductModalProps> = ({
	children,
	onClose,
	open,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[860px] max-h-screen">
				{children}
			</DialogContent>
		</Dialog>
	);
};
export default ProductModal;
