"use client";

import {
	ClipboardCheck,
	Copy,
	Edit,
	MoreHorizontal,
	TrashIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useStoreBillboards from "@/hooks/useStoreBillboards";
import { BillboardColumn } from "./columns";

interface CellActionProps {
	data: BillboardColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	const { mutate } = useStoreBillboards(params.storeId as string);

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success("Copied to clipboard", {
			style: { backgroundColor: "rgb(50,170,70)", color: "#fff" },
			icon: <ClipboardCheck />,
		});
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`/api/${params.storeId}/billboards/${data?.id}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error("Something went wrong");
			}

			mutate();
			toast.success("Billboard deleted");
		} catch (error) {
			toast.error(
				"Make sure you remove all categories using this billboard first",
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => onCopy(data.id)}
						className="cursor-pointer"
					>
						<Copy className="mr-2 h-4 w-4" />
						Copy Id
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() =>
							router.push(`/${params.storeId}/billboards/${data.id}`)
						}
						className="cursor-pointer"
					>
						<Edit className="mr-2 h-4 w-4" />
						Update
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setOpen(true)}
						className="cursor-pointer"
					>
						<TrashIcon className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
export default CellAction;
