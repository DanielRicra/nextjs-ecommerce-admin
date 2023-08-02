import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/field-validations-api";
import prismadb from "@/lib/prismadb";

export async function GET(
	_req: Request,
	{ params }: { params: { storeId: string } },
) {
	try {
		if (!params.storeId) {
			return errorResponse({ error: "Store id is required", status: 400 });
		}

		const orders = await prismadb.order.findMany({
			where: {
				storeId: params.storeId,
			},
			include: {
				orderItems: {
					include: {
						product: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(orders, { status: 200 });
	} catch (error) {
		console.log("[ORDERS_GET] ", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
