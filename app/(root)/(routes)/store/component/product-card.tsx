"use client";

import { ExpandIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

import usePreviewModal from "@/hooks/use-preview-modal";
import { ProductData } from "@/types";
import Currency from "./currency";
import IconButton from "./icons-button";

interface ProductCardProps {
	data: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
	const router = useRouter();
	const previewModal = usePreviewModal();

	const handleClick = (e: React.MouseEvent) => {
		router.push(`/store/products/${data.id}`);
	};

	const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
		event.stopPropagation();
		previewModal.onOpen(data);
	};

	return (
		<div
			className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4"
			onClick={(e) => handleClick(e)}
		>
			<div className="aspect-square rounded-xl bg-gray-100 relative">
				<Image
					src={data.images.at(0)?.url ?? ""}
					fill
					alt={data?.name}
					className="object-cover aspect-square rounded-md"
				/>

				<div className="opacity-0 -z-10 group-hover:opacity-100 group-hover:z-10 transition absolute w-full px-6 bottom-5">
					<div className="flex gap-x-6 justify-center">
						<IconButton
							onClick={onPreview}
							icon={<ExpandIcon size={20} className="text-gray-600" />}
						/>

						<IconButton
							icon={<ShoppingCartIcon size={20} className="text-gray-600" />}
						/>
					</div>
				</div>
			</div>

			<div>
				<p className="font-semibold text-lg">{data.name}</p>
				<p className="text-sm text-gray-500">{data.category.name}</p>
			</div>

			<div className="flex items-center justify-between">
				<Currency value={Number(data.price)} />
			</div>
		</div>
	);
};
export default ProductCard;
