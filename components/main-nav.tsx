"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

type RoutesType = {
	href: string;
	label: string;
	active: boolean;
};

const MainNav = ({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) => {
	const pathname = usePathname();
	const params = useParams();

	const routes: RoutesType[] = [
		{
			href: `/${params.storeId}`,
			label: "Overview",
			active: pathname === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/billboards`,
			label: "Billboards",
			active: pathname === `/${params.storeId}/billboards`,
		},
		{
			href: `/${params.storeId}/settings`,
			label: "Settings",
			active: pathname === `/${params.storeId}/settings`,
		},
	];
	return (
		<ul className={cn("flex items-center gap-1 lg:gap-2", className)}>
			{routes.map((route) => (
				<li key={route.href}>
					<Link
						href={route.href}
						className={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							route.active
								? "text-black dark:text-white"
								: "text-muted-foreground",
						)}
					>
						{route.label}
					</Link>
				</li>
			))}
		</ul>
	);
};
export default MainNav;
