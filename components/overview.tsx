"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
	data: { name: string; total: number }[];
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={data}>
				<XAxis
					dataKey="name"
					stroke="#888888"
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					tickLine={false}
					axisLine={false}
					tickFormatter={(value: number) => `$${value}`}
				/>
				<Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
};