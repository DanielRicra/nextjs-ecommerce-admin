"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/heading";
import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import useStoreSizes from "@/hooks/useStoreSizes";
import { SizeColumn, columns } from "./columns";

export const SizeClient = () => {
	const router = useRouter();
	const params = useParams();

	const { sizes } = useStoreSizes(params.storeId as string);

	const formattedSizes: SizeColumn[] =
		sizes?.map((size) => ({
			id: size.id,
			name: size.name,
			value: size.value,
			createdAt: format(new Date(size.createdAt), "MMMM do, yyyy"),
		})) ?? [];

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Sizes (${sizes?.length ?? 0})`}
					description="Manage sizes for your store"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
					<Plus className="mr-2 h-4 w-4" />
					Add new
				</Button>
			</div>

			<Separator />

			<DataTable columns={columns} data={formattedSizes} searchKey="name" />

			<Heading title="API" description="API calls for sizes" />

			<Separator />

			<ApiList entityIdName="sizeId" entityName="sizes" />
		</>
	);
};
