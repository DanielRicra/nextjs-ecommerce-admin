"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
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
import useFetchData from "@/hooks/useFetchData";

const formSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	value: z.string().min(4).regex(/^#([A-F0-9]{6}|[A-F0-9]{3})$/i, {
		message: "Value must be a valid hex code",
	}),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
	initialData: Color | null;
}

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const { mutate } = useFetchData(`/api/${params.storeId}/colors`);

	const title = initialData ? "Edit Color" : "Create Color";
	const description = initialData
		? "Edit the settings for this Color"
		: "Create a new Color";
	const toastMessage = initialData ? "Color updated" : "Color created";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ?? {
			name: "",
			value: "",
		},
	});

	const onSubmit = async (values: ColorFormValues) => {
		try {
			setLoading(true);
			const url = initialData
				? `/api/${params.storeId}/colors/${initialData.id}`
				: `/api/${params.storeId}/colors`;

			const fetchOptions = {
				method: initialData ? "PATCH" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			};

			const response = await fetch(url, fetchOptions);

			if (!response.ok) {
				throw new Error("Something went wrong");
			}

			router.refresh();
			router.push(`/${params.storeId}/colors`);
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
			const response = await fetch(
				`/api/${params.storeId}/colors/${initialData?.id}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error("Something went wrong");
			}

			mutate();
			toast.success("Color deleted");
			router.push(`/${params.storeId}/colors`);
		} catch (error) {
			toast.error("Make sure you remove all products using this color first");
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
											placeholder="Color name"
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
										<div className="flex items-center gap-x-4">
											<Input
												disabled={loading}
												{...field}
												placeholder="Example: #ff00ff"
											/>

											<div
												className="border p-4 rounded-full"
												style={{ backgroundColor: field.value }}
											/>
										</div>
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

export default ColorForm;
