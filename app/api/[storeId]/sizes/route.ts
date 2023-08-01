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

		const size = await prismadb.size.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(size, { status: 201 });
	} catch (error) {
		console.log("[SIZES_POST] ", error);
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

		const sizes = await prismadb.size.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(sizes, { status: 200 });
	} catch (error) {
		console.log("[SIZES_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
