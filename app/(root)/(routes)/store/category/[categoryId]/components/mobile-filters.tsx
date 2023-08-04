"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Color, Size } from "@prisma/client";
import Filter from "./filter";

interface MobileFiltersProps {
	sizes: Size[];
	colors: Color[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
	return (
		<Dialog>
			<DialogTrigger>
				<Button className="flex items-center gap-x-2 lg:hidden">
					Filters
					<Plus size={20} />
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<div className="p-4">
					<Filter valueKey="sizeId" name="Sizes" data={sizes} />
					<Filter valueKey="colorId" name="Colors" data={colors} />
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default MobileFilters;
