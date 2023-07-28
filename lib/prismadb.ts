import { PrismaClient } from "@prisma/client";

declare global {
	// rome-ignore lint/style/noVar: for global use
	var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = prismadb;
}

export default prismadb;
