"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/heading";
import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import useStoreCategories from "@/hooks/useStoreCategories";
import { CategoryColumn, columns } from "./columns";

export const CategoryClient = () => {
	const router = useRouter();
	const params = useParams();

	const { categories } = useStoreCategories(params.storeId as string);

	const formattedCategories: CategoryColumn[] =
		categories?.map((category) => ({
			id: category.id,
			billboardLabel: category.billboard.label,
			name: category.name,
			createdAt: format(new Date(category.createdAt), "MMMM do, yyyy"),
		})) ?? [];

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Categories (${categories?.length ?? 0})`}
					description="Manage categories for your store"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/categories/new`)}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add new
				</Button>
			</div>

			<Separator />

			<DataTable
				columns={columns}
				data={formattedCategories}
				searchKey="name"
			/>

			<Heading title="API" description="API calls for categories" />

			<Separator />

			<ApiList entityIdName="categoryId" entityName="categories" />
		</>
	);
};
