"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useStoreCategories from "@/hooks/useStoreCategories";

interface CategoryFormProps {
	initialData: Category | null;
	billboards: Billboard[];
}

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	billboardId: z.string().min(1, { message: "Select a Billboard" }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
	initialData,
	billboards,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const { mutate } = useStoreCategories(params.storeId as string);

	const title = initialData ? "Edit Category" : "Create Category";
	const description = initialData
		? "Edit the settings for this Category"
		: "Create a new Category";
	const toastMessage = initialData ? "Category updated" : "Category created";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ?? {
			name: "",
			billboardId: "",
		},
	});

	const onSubmit = async (values: CategoryFormValues) => {
		try {
			setLoading(true);
			const url = initialData
				? `/api/${params.storeId}/categories/${initialData.id}`
				: `/api/${params.storeId}/categories`;

			const fetchOptions = {
				method: initialData ? "PATCH" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			};

			await fetch(url, fetchOptions);

			router.refresh();
			router.push(`/${params.storeId}/categories`);
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
			await fetch(`/api/${params.storeId}/categories/${initialData?.id}`, {
				method: "DELETE",
			});

			mutate();
			toast.success("Category deleted");
			router.push(`/${params.storeId}/categories`);
		} catch (error) {
			toast.error(
				"Make sure you remove all products using this category first",
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
											placeholder="Category name"
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="billboardId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Billboard</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a billboard"
												/>
											</SelectTrigger>
										</FormControl>

										<SelectContent>
											{billboards.map((billboard) => (
												<SelectItem key={billboard.id} value={billboard.id}>
													{billboard.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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

export default CategoryForm;
