import { ProductData } from "@/types";
import qs from "query-string";

interface Query {
	categoryId?: string;
	colorId?: string;
	sizeId?: string;
	isFeatured?: boolean;
}

export const getProducts = async (query: Query): Promise<ProductData[]> => {
	const url = qs.stringifyUrl({
		url: "http://localhost:3000/api/c96aca53-bd8d-4e5a-9310-bc3d334235eb/products",
		query: {
			colorId: query.colorId,
			categoryId: query.categoryId,
			sizeId: query.sizeId,
			isFeatured: query.isFeatured,
			isArchived: false,
		},
	});

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Error fetching product");
	}

	return response.json();
};

export const getProductById = async (
	productId: string,
): Promise<ProductData> => {
	const response = await fetch(
		`http://localhost:3000/api/c96aca53-bd8d-4e5a-9310-bc3d334235eb/products/${productId}`,
	);

	if (!response.ok) {
		throw new Error("Error fetching product");
	}

	return response.json();
};
