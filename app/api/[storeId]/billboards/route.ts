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

		const billboard = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboard, { status: 201 });
	} catch (error) {
		console.log("[BILLBOARDS_POST] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function GET(
	_req: Request,
	{ params }: { params: { storeId: string } },
) {
	try {
		if (!params.storeId) {
			return errorResponse({ error: "Store id is required", status: 400 });
		}

		const billboards = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboards, { status: 200 });
	} catch (error) {
		console.log("[BILLBOARDS_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
