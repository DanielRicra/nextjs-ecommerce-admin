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
import { Color } from "@prisma/client";
import { ColorColumn, columns } from "./columns";

export const ColorClient = () => {
	const router = useRouter();
	const params = useParams();

	const { data: colors } = useFetchData<Color>(
		`/api/${params.storeId as string}/colors`,
	);

	const formattedColors: ColorColumn[] =
		colors?.map((color) => ({
			id: color.id,
			name: color.name,
			value: color.value,
			createdAt: format(new Date(color.createdAt), "MMMM do, yyyy"),
		})) ?? [];

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Colors (${colors?.length ?? 0})`}
					description="Manage colors for your store"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
					<Plus className="mr-2 h-4 w-4" />
					Add new
				</Button>
			</div>

			<Separator />

			<DataTable columns={columns} data={formattedColors} searchKey="name" />

			<Heading title="API" description="API calls for colors" />

			<Separator />

			<ApiList entityIdName="colorId" entityName="colors" />
		</>
	);
};
