"use client";
import React from "react";
import { useAccount } from "wagmi";
import { createClient } from "@/services/web3/subgraphClient";
import { useScaffoldWriteContract } from "@/hooks/scaffold-eth/useScaffoldWriteContract";

type Listing = {
  id: string;
  seller: string;
  tokenId: string;
  price: string;
};

export default function MarketplacePage() {
  const { address } = useAccount();
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [loading, setLoading] = React.useState(true);

  const { writeContractAsync: buyAsync, isPending } = useScaffoldWriteContract({
    contractName: "AI_Agent_Marketplace",
  });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const client = await createClient();
        const res = await client.query(`{ listings(where:{active:true} orderBy: createdAt orderDirection: desc){ id seller tokenId price } }`);
        if (mounted) setListings(res.data.listings ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onBuy = async (listingId: string, price: string) => {
    const value = BigInt(price);
    await buyAsync({
      functionName: "buyListing",
      value,
      args: [BigInt(listingId)],
    } as any);
  };

  if (loading) return <div className="p-6">Loading listings…</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(l => (
        <div key={l.id} className="rounded-xl border p-4 space-y-3">
          {/* Placeholder image; could be extended to pull from tokenURI */}
          <div className="aspect-video bg-base-200 rounded-md" />
          <div className="space-y-1">
            <div className="font-semibold">Agent #{l.tokenId}</div>
            <div className="text-sm opacity-70">Seller: {l.seller.slice(0, 6)}…{l.seller.slice(-4)}</div>
            <div className="text-sm">Price: {String(BigInt(l.price))} wei</div>
          </div>
          <button className="btn btn-primary w-full" disabled={isPending || !address} onClick={() => onBuy(l.id, l.price)}>
            {isPending ? "Buying…" : "Buy"}
          </button>
        </div>
      ))}
      {listings.length === 0 && <div>No active listings</div>}
    </div>
  );
}
