import { errorResponse } from "@/lib/field-validations-api";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { categoryId: string } },
) {
	try {
		const { searchParams } = new URL(req.url);
		const addBillboard = searchParams.get("addBillboard") ?? undefined;

		if (!params.categoryId) {
			return errorResponse({ error: "Category id is required", status: 400 });
		}

		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
			include: {
				billboard: addBillboard === "true" ? true : false,
			},
		});

		if (!category) {
			return errorResponse({ error: "Category not found", status: 404 });
		}

		return NextResponse.json(category, { status: 200 });
	} catch (error) {
		console.log("[CATEGORY_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } },
) {
	try {
		const { userId } = auth();
		const { name, billboardId } = await req.json();

		if (!userId) {
			return errorResponse({ error: "Unauthenticated", status: 401 });
		}

		if (!name) {
			return errorResponse({ error: "Name is required", status: 400 });
		}

		if (!billboardId) {
			return errorResponse({ error: "Billboard id is required", status: 400 });
		}

		if (!params.categoryId) {
			return errorResponse({ error: "Category id is required", status: 400 });
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

		const updatedCategory = await prismadb.category.update({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		});

		return NextResponse.json(updatedCategory, { status: 200 });
	} catch (error) {
		console.log("[CATEGORY_PATCH] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; categoryId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!params.categoryId) {
			return errorResponse({ error: "Category id is required", status: 400 });
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

		const deletedCategory = await prismadb.category.delete({
			where: {
				id: params.categoryId,
			},
		});

		return NextResponse.json(deletedCategory, { status: 200 });
	} catch (error) {
		console.log("[CATEGORY_DELETE] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
