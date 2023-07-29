"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import Heading from "@/components/heading";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useOrigin from "@/hooks/use-origin";

interface SettingsFormProps {
	initialData: Store;
}

const formSchema = z.object({
	name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const onSubmit = async (values: SettingsFormValues) => {
		try {
			setLoading(true);
			await fetch(`/api/stores/${params.storeId}`, {
				method: "PATCH",
				body: JSON.stringify(values),
			});
			router.refresh();
			toast.success("Store updated");
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await fetch(`/api/stores/${params.storeId}`, {
				method: "DELETE",
			});
			router.refresh();
			toast.success("Store deleted");
			router.push("/");
		} catch (error) {
			toast.error(
				"Make sure you remove all products and categories before deleting",
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				loading={loading}
				onConfirm={onDelete}
			/>

			<div className="flex items-center justify-between">
				<Heading title="Settings" description="Manage store preferences" />
				<Button
					disabled={loading}
					variant="destructive"
					size="sm"
					onClick={() => setOpen(true)}
				>
					<Trash className="h-4 w-4" />
				</Button>
			</div>

			<Separator />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											{...field}
											placeholder="Store name"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button disabled={loading} type="submit">
						Save Changes
					</Button>
				</form>
			</Form>

			<Separator />

			<ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${params.storeId}`}
				variant="admin"
			/>
		</>
	);
};

export default SettingsForm;
