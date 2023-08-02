import { ProductClient } from "./components/client";

const ProductsPage = () => {
	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductClient />
			</div>
		</div>
	);
};
export default ProductsPage;
