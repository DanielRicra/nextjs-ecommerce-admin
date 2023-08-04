import { CategoryData } from "@/types";
import { Category } from "@prisma/client";

interface Query {
	categoryId?: string;
	colorId?: string;
	sizeId?: string;
	isFeatured?: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
	const response = await fetch(
		"http://localhost:3000/api/c96aca53-bd8d-4e5a-9310-bc3d334235eb/categories",
	);

	if (!response.ok) {
		throw new Error("Error fetching product");
	}

	return response.json();
};

export const getCategoryById = async (
	categoryId: string,
): Promise<CategoryData> => {
	const response = await fetch(
		`http://localhost:3000/api/c96aca53-bd8d-4e5a-9310-bc3d334235eb/categories/${categoryId}?addBillboard=true`,
	);

	if (!response.ok) {
		throw new Error("Error fetching product");
	}

	return response.json();
};
