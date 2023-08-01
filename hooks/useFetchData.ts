import useSWR, { type Fetcher, type KeyedMutator } from "swr";

function getFetcher<T>() {
	const fetcher: Fetcher<T[], string> = (url: string) =>
		fetch(url).then((res) => res.json());
	return fetcher;
}

interface UseStoreSizes<T> {
	data: T[] | undefined;
	isLoading: boolean;
	isError: Error | undefined;
	mutate: KeyedMutator<T[]>;
}

interface FetchError extends Error {
	status?: number;
}

const useFetchData = <T>(url: string): UseStoreSizes<T> => {
	const { data, error, isLoading, mutate } = useSWR<T[], FetchError>(
		url,
		getFetcher<T>(),
		{
			onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (retryCount >= 3) return;
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		},
	);

	return {
		data,
		isLoading,
		isError: error,
		mutate,
	};
};
export default useFetchData;
