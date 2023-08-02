import type { Category, Color, Product, Size } from "@prisma/client";

export interface ProductResponse extends Product {
	category: Category;
	size: Size;
	color: Color;
}
