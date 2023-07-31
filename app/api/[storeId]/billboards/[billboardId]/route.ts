import { errorResponse } from "@/lib/field-validations-api";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
	_req: Request,
	{ params }: { params: { billboardId: string } },
) {
	try {
		if (!params.billboardId) {
			return errorResponse({ error: "Billboard id is required", status: 400 });
		}

		const billboard = await prismadb.billboard.findUnique({
			where: {
				id: params.billboardId,
			},
		});

		if (!billboard) {
			return errorResponse({ error: "Billboard not found", status: 404 });
		}

		return NextResponse.json(billboard, { status: 200 });
	} catch (error) {
		console.log("[Billboard_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } },
) {
	try {
		const { userId } = auth();
		const { label, imageUrl } = await req.json();

		if (!userId) {
			return errorResponse({ error: "Unauthenticated", status: 401 });
		}

		if (!label) {
			return errorResponse({ error: "Label is required", status: 400 });
		}

		if (!imageUrl) {
			return errorResponse({ error: "Image URL is required", status: 400 });
		}

		if (!params.billboardId) {
			return errorResponse({ error: "Billboard id is required", status: 400 });
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

		const updatedStore = await prismadb.billboard.update({
			where: {
				id: params.billboardId,
			},
			data: {
				label,
				imageUrl,
			},
		});

		return NextResponse.json(updatedStore, { status: 200 });
	} catch (error) {
		console.log("[BILLBOARD_PATCH] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; billboardId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!params.billboardId) {
			return errorResponse({ error: "Billboard id is required", status: 400 });
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

		const deletedBillboard = await prismadb.billboard.delete({
			where: {
				id: params.billboardId,
			},
		});

		return NextResponse.json(deletedBillboard, { status: 200 });
	} catch (error) {
		console.log("[Billboard_DELETE] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
