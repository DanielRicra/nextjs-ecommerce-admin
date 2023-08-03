import Container from "@/components/ui/container";
import { getProductById, getProducts } from "@/services/product-service";
import Gallery from "../../component/gallery";
import Info from "../../component/info";
import ProductList from "../../component/product-list";

interface ProductPageProps {
	params: {
		productId: string;
	};
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
	const product = await getProductById(params.productId);
	const suggestedProducts = await getProducts({
		categoryId: product.categoryId,
	});
	return (
		<div>
			<Container>
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
						<Gallery images={product.images} />
						<Info data={product} />
					</div>

					<hr className="my-10" />

					<ProductList title="Related Items" items={suggestedProducts} />
				</div>
			</Container>
		</div>
	);
};
export default ProductPage;
