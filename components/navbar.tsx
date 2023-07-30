import MainNav from "@/components/main-nav";

import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Navbar = async () => {
	const { userId } = auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const stores = await prismadb.store.findMany({ where: { userId } });

	return (
		<header className="border-b">
			<nav className="flex h-16 items-center px-4 gap-4">
				<StoreSwitcher items={stores} className="" />
				<MainNav />
				<div className="ml-auto flex items-center space-x-4">
					<UserButton afterSignOutUrl="/" />
				</div>
			</nav>
		</header>
	);
};
export default Navbar;
