import { Size } from "@prisma/client";
import useSWR, { Fetcher, KeyedMutator } from "swr";

const fetcher: Fetcher<Size[], string> = (url: string) =>
	fetch(url).then((res) => res.json());

interface UseStoreSizes {
	sizes: Size[] | undefined;
	isLoading: boolean;
	isError: Error | undefined;
	mutate: KeyedMutator<Size[]>;
}

const useStoreSizes = (storeId: string): UseStoreSizes => {
	const { data, error, isLoading, mutate } = useSWR<Size[], Error>(
		`/api/${storeId}/sizes`,
		fetcher,
	);

	return {
		sizes: data,
		isLoading,
		isError: error,
		mutate,
	};
};
export default useStoreSizes;
