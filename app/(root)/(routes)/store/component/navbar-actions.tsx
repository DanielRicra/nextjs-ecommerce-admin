"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const NavbarActions = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className="ml-auto flex items-center gap-x-4">
			<Button className="rounded-full flex gap-2 items-center">
				<ShoppingBagIcon size={20} color="white" />
				<span className="text-sm font-medium text-white">0</span>
			</Button>
		</div>
	);
};
export default NavbarActions;
