"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import Heading from "@/components/heading";
import AlertModal from "@/components/modals/alert-modal";
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
import useStoreSizes from "@/hooks/useStoreSizes";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	value: z.string().min(1, { message: "Value is required" }),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
	initialData: Size | null;
}

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const { mutate } = useStoreSizes(params.storeId as string);

	const title = initialData ? "Edit Size" : "Create Size";
	const description = initialData
		? "Edit the settings for this Size"
		: "Create a new Size";
	const toastMessage = initialData ? "Size updated" : "Size created";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ?? {
			name: "",
			value: "",
		},
	});

	const onSubmit = async (values: SizeFormValues) => {
		try {
			setLoading(true);
			const url = initialData
				? `/api/${params.storeId}/sizes/${initialData.id}`
				: `/api/${params.storeId}/sizes`;

			const fetchOptions = {
				method: initialData ? "PATCH" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			};

			await fetch(url, fetchOptions);

			router.refresh();
			router.push(`/${params.storeId}/sizes`);
			toast.success(toastMessage);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await fetch(`/api/${params.storeId}/sizes/${initialData?.id}`, {
				method: "DELETE",
			});

			mutate();
			toast.success("Size deleted");
			router.push(`/${params.storeId}/sizes`);
		} catch (error) {
			toast.error("Make sure you remove all products using this size first");
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
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="sm"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
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
											placeholder="Size name"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											{...field}
											placeholder="Size value"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button disabled={loading} type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default SizeForm;
