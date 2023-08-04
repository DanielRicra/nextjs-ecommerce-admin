import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import { getCategoryById } from "@/services/category-service";
import { getColors } from "@/services/color-service";
import { getProducts } from "@/services/product-service";
import { getSizes } from "@/services/size-service";
import Billboard from "../../component/billboard";
import ProductCard from "../../component/product-card";
import Filter from "./components/filter";
import MobileFilters from "./components/mobile-filters";

interface CategoryPageProps {
	params: { categoryId: string };
	searchParams: { colorId: string; sizeId: string };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
	params,
	searchParams,
}) => {
	const products = await getProducts({
		isFeatured: true,
		categoryId: params.categoryId,
		colorId: searchParams.colorId,
		sizeId: searchParams.sizeId,
	});
	const sizes = await getSizes();
	const colors = await getColors();
	const category = await getCategoryById(params.categoryId);

	return (
		<div className="bg-white">
			<Container>
				<Billboard data={category.billboard} />

				<div className="px-4 sm:px-6 lg:px-8 pb-24">
					<div className="flex flex-col lg:flex-row lg:gap-x-8 gap-5">
						<MobileFilters sizes={sizes} colors={colors} />

						<div className="hidden lg:block">
							<Filter valueKey="sizeId" name="Sizes" data={sizes} />
							<Filter valueKey="colorId" name="Colors" data={colors} />
						</div>

						<div className="mt-6 lg:col-span-4 lg:mt-0">
							{products.length === 0 && <NoResults />}
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
								{products.map((product) => (
									<ProductCard data={product} key={product.id} />
								))}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};
export default CategoryPage;
