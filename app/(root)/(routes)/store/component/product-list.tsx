import NoResults from "@/components/ui/no-results";
import { ProductData } from "@/types";
import ProductCard from "./product-card";

interface ProductListProps {
	items: ProductData[];
	title: string;
}

const ProductList: React.FC<ProductListProps> = ({ items, title }) => {
	return (
		<div className="space-y-4">
			<h3 className="font-bold text-3xl">{title}</h3>

			{items.length === 0 && <NoResults />}

			<div className="grid grid-cols-1 sm:gild-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{items.map((item) => (
					<ProductCard key={item.id} data={item} />
				))}
			</div>
		</div>
	);
};
export default ProductList;
