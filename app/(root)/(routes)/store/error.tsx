"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	return (
		<div>
			<h2 className="text-red-500 font-bold p-6 text-2xl">
				Something went wrong!
			</h2>
			<Button
				type="button"
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</Button>
		</div>
	);
};
export default ErrorPage;
