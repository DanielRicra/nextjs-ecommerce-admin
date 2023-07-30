import { Billboard } from "@prisma/client";
import useSWR, { Fetcher, KeyedMutator } from "swr";

const fetcher: Fetcher<Billboard[], string> = (url: string) =>
	fetch(url).then((res) => res.json());

interface UseStoreBillboards {
	billboards: Billboard[] | undefined;
	isLoading: boolean;
	isError: Error | undefined;
	mutate: KeyedMutator<Billboard[]>;
}

const useStoreBillboards = (storeId: string): UseStoreBillboards => {
	const { data, error, isLoading, mutate } = useSWR<Billboard[], Error>(
		`/api/${storeId}/billboards`,
		fetcher,
	);

	return {
		billboards: data,
		isLoading,
		isError: error,
		mutate,
	};
};
export default useStoreBillboards;
