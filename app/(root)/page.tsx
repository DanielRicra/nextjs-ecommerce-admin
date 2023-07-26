import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<p>Welcome to Next.js</p>
			<div className="">
				<Button size="lg" variant="outline">
					Click me
				</Button>
			</div>
		</main>
	);
}
