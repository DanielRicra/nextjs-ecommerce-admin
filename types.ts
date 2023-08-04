import type {
	Billboard,
	Category,
	Color,
	Image,
	Product,
	Size,
} from "@prisma/client";

export interface ProductData extends Product {
	images: Image[];
	category: Category;
	size: Size;
	color: Color;
}

export interface CategoryData extends Category {
	billboard: Billboard;
}
