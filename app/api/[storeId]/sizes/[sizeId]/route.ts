import { errorResponse } from "@/lib/field-validations-api";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{ params }: { params: { sizeId: string } },
) {
	try {
		if (!params.sizeId) {
			return errorResponse({ error: "Size id is required", status: 400 });
		}

		const size = await prismadb.size.findUnique({
			where: {
				id: params.sizeId,
			},
		});

		if (!size) {
			return errorResponse({ error: "Size not found", status: 404 });
		}

		return NextResponse.json(size, { status: 200 });
	} catch (error) {
		console.log("[SIZE_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; sizeId: string } },
) {
	try {
		const { userId } = auth();
		const { name, value } = await req.json();

		if (!userId) {
			return errorResponse({ error: "Unauthenticated", status: 401 });
		}

		if (!name) {
			return errorResponse({ error: "Name is required", status: 400 });
		}

		if (!value) {
			return errorResponse({ error: "Value is required", status: 400 });
		}

		if (!params.sizeId) {
			return errorResponse({ error: "Size id is required", status: 400 });
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

		const updatedSize = await prismadb.size.update({
			where: {
				id: params.sizeId,
			},
			data: {
				name,
				value,
			},
		});

		return NextResponse.json(updatedSize, { status: 200 });
	} catch (error) {
		console.log("[SIZE_PATCH] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; sizeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!params.sizeId) {
			return errorResponse({ error: "Size id is required", status: 400 });
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

		const deletedSize = await prismadb.size.delete({
			where: {
				id: params.sizeId,
			},
		});

		return NextResponse.json(deletedSize, { status: 200 });
	} catch (error) {
		console.log("[SIZE_DELETE] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
