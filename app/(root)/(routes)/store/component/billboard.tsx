import { type Billboard as BillboardModel } from "@prisma/client";

interface BillboardProps {
	data: BillboardModel;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
	return (
		<div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
			<div
				style={{
					backgroundImage: `url(${data.imageUrl})`,
				}}
				className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
			>
				<div className="h-full w-full flex justify-center items-center gap-y-8">
					<div
						className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs"
						style={{
							textShadow:
								"0 0 7px #fff, 0 0 10px #fff,0 0 12px #fff, 0 0 8px #fff",
						}}
					>
						{data.label}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Billboard;
