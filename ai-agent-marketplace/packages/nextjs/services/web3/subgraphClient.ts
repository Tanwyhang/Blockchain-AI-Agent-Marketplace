export type ListingGql = {
	id: string; // listingId
	seller: string;
	tokenId: string; // BigInt as string
	price: string; // BigInt as string (wei)
};

const DEFAULT_SUBGRAPH_URL =
	process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
	"http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

export async function fetchActiveListings(signal?: AbortSignal): Promise<ListingGql[]> {
	const query = `
		query ActiveListings {
			listings(where: { active: true }) {
				id
				seller
				tokenId
				price
			}
		}
	`;

	const res = await fetch(DEFAULT_SUBGRAPH_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
		signal,
	});

	if (!res.ok) {
		throw new Error(`Subgraph error: ${res.status} ${res.statusText}`);
	}
	const json = await res.json();
	if (json.errors) {
		throw new Error(`Subgraph GraphQL errors: ${JSON.stringify(json.errors)}`);
	}
	return (json.data?.listings || []) as ListingGql[];
}

