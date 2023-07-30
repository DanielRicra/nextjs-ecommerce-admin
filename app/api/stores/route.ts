import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const { name } = await req.json();

		if (!userId) {
			return NextResponse.json({ error: "Unauthenticated " }, { status: 401 });
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
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
