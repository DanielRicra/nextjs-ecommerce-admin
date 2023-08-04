import ProductModalProvider from "@/providers/product-modal-provider";
import { Urbanist } from "next/font/google";
import Footer from "./component/footer";
import Navbar from "./component/store-navbar";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
	title: "Store-Admin",
	description: "Store",
};

async function StoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={font.className}>
			<ProductModalProvider />
			<Navbar />
			{children}
			<Footer />
		</div>
	);
}

export default StoreLayout;
