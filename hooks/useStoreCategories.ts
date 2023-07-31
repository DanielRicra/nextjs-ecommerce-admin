import { Billboard, Category } from "@prisma/client";
import useSWR, { Fetcher, KeyedMutator } from "swr";

interface StoreCategoriesResponse extends Category {
	billboard: Billboard;
}

const fetcher: Fetcher<StoreCategoriesResponse[], string> = (url: string) =>
	fetch(url).then((res) => res.json());

interface UseStoreCategories {
	categories: StoreCategoriesResponse[] | undefined;
	isLoading: boolean;
	isError: Error | undefined;
	mutate: KeyedMutator<StoreCategoriesResponse[]>;
}

const useStoreCategories = (storeId: string): UseStoreCategories => {
	const { data, error, isLoading, mutate } = useSWR<
		StoreCategoriesResponse[],
		Error
	>(`/api/${storeId}/categories`, fetcher);

	return {
		categories: data,
		isLoading,
		isError: error,
		mutate,
	};
};
export default useStoreCategories;
