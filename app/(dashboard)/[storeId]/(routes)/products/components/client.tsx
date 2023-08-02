"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/heading";
import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import useFetchData from "@/hooks/useFetchData";
import { formatter } from "@/lib/utils";
import { ProductResponse } from "../types";
import { ProductColumn, columns } from "./columns";

export const ProductClient = () => {
	const router = useRouter();
	const params = useParams();

	const { data: products } = useFetchData<ProductResponse>(
		`/api/${params.storeId}/products?`,
	);

	const formattedProducts: ProductColumn[] =
		products?.map((product) => ({
			id: product.id,
			name: product.name,
			isFeatured: product.isFeatured,
			isArchived: product.isArchived,
			price: formatter.format(Number(product.price)),
			category: product.category.name,
			size: product.size.name,
			color: product.color.value,
			createdAt: format(new Date(product.createdAt), "MMMM do, yyyy"),
		})) ?? [];

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Products (${products?.length ?? 0})`}
					description="Manage products for your store"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
					<Plus className="mr-2 h-4 w-4" />
					Add new
				</Button>
			</div>

			<Separator />

			<DataTable columns={columns} data={formattedProducts} searchKey="name" />

			<Heading title="API" description="API calls for products" />

			<Separator />

			<ApiList entityIdName="productId" entityName="products" />
		</>
	);
};
