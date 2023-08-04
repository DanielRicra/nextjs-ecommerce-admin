import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get("Stripe-Signature") as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET as string,
		);
	} catch (err) {
		return NextResponse.json({ error: "Webhook error" }, { status: 400 });
	}

	const session = event.data.object as Stripe.Checkout.Session;

	const address = session.customer_details?.address;

	const addressComponent = [
		address?.line1,
		address?.line2,
		address?.city,
		address?.state,
		address?.postal_code,
		address?.country,
	];

	const addressString = addressComponent.filter(Boolean).join(", ");

	if (event.type === "checkout.session.completed") {
		const updatedOrder = await prismadb.order.update({
			where: {
				id: session.metadata?.orderId,
			},
			data: {
				isPaid: true,
				address: addressString,
				phone: session.customer_details?.phone ?? "",
			},
			include: {
				orderItems: true,
			},
		});

		const productIds = updatedOrder.orderItems.map((item) => item.productId);

		await prismadb.product.updateMany({
			where: {
				id: {
					in: [...productIds],
				},
			},
			data: { isArchived: true },
		});
	}

	return NextResponse.json(null, { status: 200 });
}
