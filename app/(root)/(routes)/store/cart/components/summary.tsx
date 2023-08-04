"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import Currency from "../../component/currency";

const Summary = () => {
	const searchParams = useSearchParams();
	const items = useCart((state) => state.items);
	const removeAll = useCart((state) => state.removeAll);

	useEffect(() => {
		if (searchParams.get("success")) {
			toast.success("Payment completed.");
			removeAll();
		}

		if (searchParams.get("canceled")) {
			toast.error("Checkout canceled.");
		}
	}, [searchParams, removeAll]);

	const totalPrice = items.reduce((total, item) => {
		return total + Number(item.price);
	}, 0);

	const onCheckout = async () => {
		const response = await fetch(
			"http://localhost:3000/api/c96aca53-bd8d-4e5a-9310-bc3d334235eb/checkout",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productIds: items.map((item) => item.id),
				}),
			},
		);

		const data = await response.json();

		window.location = data.url;
	};

	return (
		<div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
			<h2 className="text-lg font-medium text-gray-900">Order summary</h2>
			<div className="mt-6 space-y-4">
				<div className="flex items-center justify-between border-t border-gray-200 pt-4">
					<div className="text-base font-medium text-gray-900">Order total</div>
					<Currency value={totalPrice} />
				</div>
			</div>
			<Button
				onClick={onCheckout}
				disabled={items.length === 0}
				className="w-full mt-6"
			>
				Checkout
			</Button>
		</div>
	);
};

export default Summary;
