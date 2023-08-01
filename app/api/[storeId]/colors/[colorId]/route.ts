import { errorResponse } from "@/lib/field-validations-api";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{ params }: { params: { colorId: string } },
) {
	try {
		if (!params.colorId) {
			return errorResponse({ error: "Color id is required", status: 400 });
		}

		const color = await prismadb.color.findUnique({
			where: {
				id: params.colorId,
			},
		});

		if (!color) {
			return errorResponse({ error: "Color not found", status: 404 });
		}

		return NextResponse.json(color, { status: 200 });
	} catch (error) {
		console.log("[COLOR_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; colorId: string } },
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

		if (!params.colorId) {
			return errorResponse({ error: "Color id is required", status: 400 });
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

		const updatedColor = await prismadb.color.update({
			where: {
				id: params.colorId,
			},
			data: {
				name,
				value,
			},
		});

		return NextResponse.json(updatedColor, { status: 200 });
	} catch (error) {
		console.log("[COLOR_PATCH] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; colorId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!params.colorId) {
			return errorResponse({ error: "Color id is required", status: 400 });
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

		const deletedColor = await prismadb.color.delete({
			where: {
				id: params.colorId,
			},
		});

		return NextResponse.json(deletedColor, { status: 200 });
	} catch (error) {
		console.log("[COLOR_DELETE] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
