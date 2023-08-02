"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";

import Heading from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import useFetchData from "@/hooks/useFetchData";
import { formatter } from "@/lib/utils";
import { columns, type OrderColumn } from "./columns";

import { Order, OrderItem, Product } from "@prisma/client";

interface OrdersResponse extends Order {
	orderItems: (OrderItem & { product: Product })[];
}

export const OrderClient = () => {
	const params = useParams();

	const { data: orders } = useFetchData<OrdersResponse>(
		`/api/${params.storeId}/orders?`,
	);

	const formattedOrders: OrderColumn[] =
		orders?.map((order) => ({
			id: order.id,
			phone: order.phone,
			address: order.address,
			isPaid: order.isPaid,
			products: order.orderItems.map((item) => item.product.name).join(", "),
			totalPrice: formatter.format(
				order.orderItems.reduce(
					(total, item) => total + Number(item.product.price),
					0,
				),
			),
			createdAt: format(new Date(order.createdAt), "MMMM do, yyyy"),
		})) ?? [];

	return (
		<>
			<Heading
				title={`Orders (${orders?.length ?? 0})`}
				description="Manage Orders for your store"
			/>

			<Separator />

			<DataTable
				columns={columns}
				data={formattedOrders}
				searchKey="products"
			/>
		</>
	);
};
