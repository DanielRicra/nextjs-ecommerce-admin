"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useOrigin from "@/hooks/use-origin";

interface BillboardFormProps {
	initialData: Billboard | null;
}

const formSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? "Edit Billboard" : "Create Billboard";
	const description = initialData
		? "Edit the settings for this billboard"
		: "Create a new billboard";
	const toastMessage = initialData ? "Store updated" : "Store created";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ?? {
			imageUrl: "",
			label: "",
		},
	});

	const onSubmit = async (values: BillboardFormValues) => {
		try {
			setLoading(true);
			const url = initialData
				? `/api/${params.storeId}/billboards/${initialData.id}`
				: `/api/${params.storeId}/billboards`;

			const fetchOptions = {
				method: initialData ? "PATCH" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			};

			await fetch(url, fetchOptions);

			router.refresh();
			router.push(`/${params.storeId}/billboards`);
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
			await fetch(`/api/${params.storeId}/billboards/${initialData?.id}`, {
				method: "DELETE",
			});
			router.refresh();
			toast.success("Billboard deleted");
			router.push("/");
		} catch (error) {
			toast.error(
				"Make sure you remove all categories using this billboard first",
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
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background Image</FormLabel>
								<FormControl>
									<ImageUpload
										onChange={(url) => field.onChange(url)}
										value={field.value ? [field.value] : []}
										onRemove={() => field.onChange("")}
										disabled={loading}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											{...field}
											placeholder="Billboard label"
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

			<Separator />
		</>
	);
};

export default BillboardForm;
