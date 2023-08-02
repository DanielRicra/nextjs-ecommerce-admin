import { errorResponse } from "@/lib/field-validations-api";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{ params }: { params: { productId: string } },
) {
	try {
		if (!params.productId) {
			return errorResponse({ error: "Product id is required", status: 400 });
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: { images: true, category: true, size: true, color: true },
		});

		if (!product) {
			return errorResponse({ error: "Product not found", status: 404 });
		}

		return NextResponse.json(product, { status: 200 });
	} catch (error) {
		console.log("[PRODUCT_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } },
) {
	try {
		const { userId } = auth();
		const {
			name,
			price,
			categoryId,
			colorId,
			sizeId,
			isFeatured,
			isArchived,
			images,
		} = await req.json();

		if (!userId) {
			return errorResponse({ error: "Unauthenticated", status: 401 });
		}

		if (!name) {
			return errorResponse({ error: "name is required", status: 400 });
		}

		if (!images || !images.length) {
			return errorResponse({ error: "Images are required", status: 400 });
		}

		if (!price) {
			return errorResponse({ error: "Price is required", status: 400 });
		}

		if (!categoryId) {
			return errorResponse({ error: "Category id is required", status: 400 });
		}

		if (!sizeId) {
			return errorResponse({ error: "Size id is required", status: 400 });
		}

		if (!colorId) {
			return errorResponse({ error: "Color id is required", status: 400 });
		}

		if (!params.productId) {
			return errorResponse({ error: "Product id is required", status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return errorResponse({ error: "Unauthorized", status: 403 });
		}

		await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				categoryId,
				colorId,
				sizeId,
				isFeatured,
				isArchived,
				images: { deleteMany: {} },
			},
		});

		const updatedProduct = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				images: { createMany: { data: images } },
			},
		});

		return NextResponse.json(updatedProduct, { status: 200 });
	} catch (error) {
		console.log("[product_PATCH] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; productId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!params.productId) {
			return errorResponse({ error: "Product id is required", status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return errorResponse({ error: "Unauthorized", status: 403 });
		}

		const deletedProduct = await prismadb.product.delete({
			where: {
				id: params.productId,
			},
		});

		return NextResponse.json(deletedProduct, { status: 200 });
	} catch (error) {
		console.log("[Product_DELETE] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
