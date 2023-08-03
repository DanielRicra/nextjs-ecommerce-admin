import Container from "@/components/ui/container";
import { getBillboardById } from "@/services/billboard-service";
import { getProducts } from "@/services/product-service";
import Billboard from "./component/billboard";
import ProductList from "./component/product-list";

const HomePage = async () => {
	const billboard = await getBillboardById(
		"6eb38679-845e-4b11-809f-dae1f5ddf68b",
	);
	const products = await getProducts({ isFeatured: true });

	return (
		<Container>
			<div className="space-y-10 pb-10">
				<Billboard data={billboard} />

				<div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
					<ProductList items={products} title="Featured Products" />
				</div>
			</div>
		</Container>
	);
};

export default HomePage;
