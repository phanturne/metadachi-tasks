export const fetcher = <T>(
	...args: [input: RequestInfo, init?: RequestInit]
): Promise<T> => {
	return fetch(...args).then((res) => {
		if (!res.ok) {
			throw new Error("Network response was not ok");
		}
		return res.json() as Promise<T>;
	});
};
