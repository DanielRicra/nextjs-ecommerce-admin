"use client";

import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "./button";

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	onChange,
	onRemove,
	value,
	disabled,
}) => {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUpload = (result: { info: { secure_url: string } }) => {
		onChange(result.info.secure_url);
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div>
			<div className="mb-4 flex items-center gap-4">
				{value.map((url, i) => (
					<div
						key={url + i}
						className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-gray-300 dark:border-gray-700"
					>
						<div className="z-10 absolute top-2 right-2">
							<Button
								type="button"
								onClick={() => onRemove(url)}
								variant="destructive"
							>
								<Trash className="w-6 h-6" />
							</Button>
						</div>

						<Image src={url} fill className="object-cover" alt="Image" />
					</div>
				))}
			</div>

			<CldUploadWidget onUpload={onUpload} uploadPreset="kd3olllt">
				{({ open }) => {
					const onClick = (e: React.MouseEvent) => {
						e.preventDefault();
						open();
					};

					return (
						<Button
							type="button"
							disabled={disabled}
							variant="secondary"
							onClick={onClick}
						>
							<ImagePlus className="h-4 w-4 mr-2" />
							Upload an Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};
export default ImageUpload;
