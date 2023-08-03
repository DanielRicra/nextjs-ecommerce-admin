"use client";

import { Billboard, Category } from "@prisma/client";

import Container from "@/components/ui/container";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";
import MainNav from "./main-nav";
import NavbarActions from "./navbar-actions";

interface CategoryResponse extends Category {
	billboard: Billboard;
}

const StoreNavbar = () => {
	const { data: categories } = useFetchData<CategoryResponse>(
		"/api/c96aca53-bd8d-4e5a-9310-bc3d334235eb/categories",
	);

	return (
		<div className="border-b">
			<Container>
				<div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
					<Link href="/store" className="ml-4 flex lg:ml-0 gap-x-2">
						<p className="font-bold text-xl uppercase	">Store</p>
					</Link>

					<MainNav data={categories ?? []} />

					<NavbarActions />
				</div>
			</Container>
		</div>
	);
};
export default StoreNavbar;
