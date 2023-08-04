import { Color } from "@prisma/client";

export const getColors = async (): Promise<Color[]> => {
	const response = await fetch(
		"http://localhost:3000/api/c96aca53-bd8d-4e5a-9310-bc3d334235eb/colors",
	);

	if (!response.ok) {
		throw new Error("Error fetching data");
	}

	return response.json();
};
