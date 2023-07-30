import { NextResponse } from "next/server";

type ErrorResponse = {
	error: string;
	status: number;
};

export function errorResponse({ error, status }: ErrorResponse) {
	return NextResponse.json({ error }, { status });
}
