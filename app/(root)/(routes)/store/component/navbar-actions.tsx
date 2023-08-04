"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

const NavbarActions = () => {
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();

	const cart = useCart();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className="ml-auto flex items-center gap-x-4">
			<Button
				className="rounded-full flex gap-2 items-center"
				onClick={() => router.push("/store/cart")}
			>
				<ShoppingBagIcon size={20} color="white" />
				<span className="text-sm font-medium text-white">
					{cart.items.length}
				</span>
			</Button>
		</div>
	);
};
export default NavbarActions;
