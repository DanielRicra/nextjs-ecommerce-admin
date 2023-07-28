import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name } = body;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 4001 });
		}

		if (!name) {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}

		const store = await prismadb.store.create({
			data: {
				name,
				userId,
			},
		});

		return NextResponse.json(store, { status: 201 });
	} catch (error) {
		console.log("[STORE_POST] ", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}