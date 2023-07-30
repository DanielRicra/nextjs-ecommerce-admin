"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/heading";
import ApiList from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import useStoreBillboards from "@/hooks/useStoreBillboards";
import { BillboardColumn, columns } from "./columns";

export const BillboardClient = () => {
	const router = useRouter();
	const params = useParams();

	const { billboards } = useStoreBillboards(params.storeId as string);

	const formattedBillboards: BillboardColumn[] =
		billboards?.map((billboard) => ({
			id: billboard.id,
			label: billboard.label,
			createdAt: format(new Date(billboard.createdAt), "MMMM do, yyyy"),
		})) ?? [];

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Billboards (${billboards?.length ?? 0})`}
					description="Manage billboards for your store"
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/billboards/new`)}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add new
				</Button>
			</div>

			<Separator />

			<DataTable
				columns={columns}
				data={formattedBillboards}
				searchKey="label"
			/>

			<Heading title="API" description="API calls for billboards" />

			<Separator />

			<ApiList entityIdName="billboardId" entityName="billboards" />
		</>
	);
};
