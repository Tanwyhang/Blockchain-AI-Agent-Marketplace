const DEFAULT_ENDPOINT = process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

export async function createClient(endpoint: string = DEFAULT_ENDPOINT) {
  return {
    async query(query: string, variables?: Record<string, any>) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      if (!res.ok) throw new Error(`Subgraph error: ${res.status}`);
      return res.json();
    },
  };
}
