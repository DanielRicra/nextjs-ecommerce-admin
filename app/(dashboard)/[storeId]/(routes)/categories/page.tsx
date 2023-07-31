import { CategoryClient } from "./components/client";

const CategoriesPage = () => {
	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CategoryClient />
			</div>
		</div>
	);
};
export default CategoriesPage;
