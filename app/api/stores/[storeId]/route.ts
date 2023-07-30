import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { name } = await req.json();

		if (!name) {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}

		if (!params.storeId) {
			return NextResponse.json(
				{ error: "Store ID is required" },
				{ status: 400 },
			);
		}

		const updatedStore = await prismadb.store.updateMany({
			where: {
				id: params.storeId,
				userId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(updatedStore, { status: 200 });
	} catch (error) {
		console.log("[Store_PATCH] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!params.storeId) {
			return NextResponse.json(
				{ error: "Store ID is required" },
				{ status: 400 },
			);
		}

		const deletedStore = await prismadb.store.delete({
			where: {
				id: params.storeId,
			},
		});

		return NextResponse.json(deletedStore, { status: 200 });
	} catch (error) {
		console.log("[Store_DELETE] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
