import { toast } from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ProductData } from "@/types";

interface CartStore {
	items: ProductData[];
	addItem: (data: ProductData) => void;
	removeItem: (id: string) => void;
	removeAll: () => void;
}

const useCart = create(
	persist<CartStore>(
		(set, get) => ({
			items: [],
			addItem: (data: ProductData) => {
				const currentItems = get().items;
				const existingItem = currentItems.find((item) => item.id === data.id);

				if (existingItem) {
					return toast("Item already in cart.");
				}

				set({ items: [...get().items, data] });
				toast.success("Item added to cart.");
			},
			removeItem: (id: string) => {
				set({ items: [...get().items.filter((item) => item.id !== id)] });
				toast.success("Item removed from cart.");
			},
			removeAll: () => set({ items: [] }),
		}),
		{
			name: "cart-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useCart;
