import { OrderClient } from "./components/client";

const OrdersPage = () => {
	return (
		<div className="flex flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<OrderClient />
			</div>
		</div>
	);
};
export default OrdersPage;
