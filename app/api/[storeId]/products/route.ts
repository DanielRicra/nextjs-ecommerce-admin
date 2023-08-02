import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/field-validations-api";
import prismadb from "@/lib/prismadb";

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } },
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

		if (!params.storeId) {
			return errorResponse({ error: "Store id is required", status: 400 });
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

		const product = await prismadb.product.create({
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				categoryId,
				sizeId,
				colorId,
				storeId: params.storeId,
				images: {
					createMany: {
						data: images,
					},
				},
			},
		});

		return NextResponse.json(product, { status: 201 });
	} catch (error) {
		console.log("[PRODUCTS_POST] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } },
) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get("categoryId") ?? undefined;
		const colorId = searchParams.get("colorId") ?? undefined;
		const sizeId = searchParams.get("sizeId") ?? undefined;
		const isFeatured = searchParams.get("isFeatured");
		const isArchived = searchParams.get("isArchived");

		if (!params.storeId) {
			return errorResponse({ error: "Store id is required", status: 400 });
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured === "true" ? true : undefined,
				isArchived: isArchived === "true" ? true : undefined,
			},
			include: { images: true, category: true, color: true, size: true },
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(products, { status: 200 });
	} catch (error) {
		console.log("[PRODUCTS_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
