import { ColorClient } from "./components/client";

const ColorsPage = () => {
	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ColorClient />
			</div>
		</div>
	);
};
export default ColorsPage;
