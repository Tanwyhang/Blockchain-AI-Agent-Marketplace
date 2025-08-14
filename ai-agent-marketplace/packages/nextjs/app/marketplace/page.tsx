"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchActiveListings, ListingGql } from "~~/services/web3/subgraphClient";
import deployedContracts from "~~/contracts/deployedContracts";
import { formatEther } from "viem";
import { useAccount, useWriteContract, useReadContract } from "wagmi";

// Flat design card component with custom color theme
function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#FDFBEF] border border-[#DAD7B6] p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#9E9A83]">
            {children}
        </div>
    );
}

export default function MarketplacePage() {
    const [listings, setListings] = useState<ListingGql[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { address } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();

    const marketAddress = useMemo(() => {
        return (deployedContracts as any)[31337]?.AI_Agent_Marketplace?.address as `0x${string}` | undefined;
    }, []);
    const agentNftAddress = useMemo(() => {
        return (deployedContracts as any)[31337]?.AI_Agent_NFT?.address as `0x${string}` | undefined;
    }, []);
    const agentNftAbi = useMemo(() => {
        return (deployedContracts as any)[31337]?.AI_Agent_NFT?.abi;
    }, []);

    // Fetch agent metadata for each listing
    const [agentMetas, setAgentMetas] = useState<Record<string, any>>({});
    useEffect(() => {
        if (!agentNftAddress || !agentNftAbi || listings.length === 0) return;
        let ignore = false;
        (async () => {
            const metas: Record<string, any> = {};
            for (const l of listings) {
                try {
                    const res = await useReadContract({
                        address: agentNftAddress,
                        abi: agentNftAbi,
                        functionName: "getAgent",
                        args: [BigInt(l.tokenId)],
                    });
                    metas[l.tokenId] = res;
                } catch {
                    metas[l.tokenId] = null;
                }
            }
            if (!ignore) setAgentMetas(metas);
        })();
        return () => { ignore = true; };
    }, [listings, agentNftAddress, agentNftAbi]);

    useEffect(() => {
        let abort = new AbortController();
        (async () => {
            try {
                const data = await fetchActiveListings(abort.signal);
                setListings(data);
            } catch (e: any) {
                setError(e?.message || "Failed to fetch");
            } finally {
                setLoading(false);
            }
        })();
        return () => abort.abort();
    }, []);

    async function onBuy(listingId: string, priceWei: string) {
        if (!marketAddress) return alert("Marketplace not deployed in mapping");
        try {
            await writeContractAsync({
                address: marketAddress,
                abi: (deployedContracts as any)[31337].AI_Agent_Marketplace.abi,
                functionName: "buyListing",
                args: [BigInt(listingId)],
                value: BigInt(priceWei),
            });
        } catch (e: any) {
            alert(e?.message || "Buy failed");
        }
    }

    return (
        <div 
            className="min-h-screen bg-[#FDFBEF] relative"
            style={{
                backgroundImage: `radial-gradient(circle, #DAD7B6 2px, transparent 2px)`,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px'
            }}
        >
            <div className="container mx-auto p-8 space-y-8 relative z-10">
                <h1 className="text-3xl font-bold text-[#2C2B28] pb-2">
                    AI Agent Marketplace
                </h1>
                
                {loading && <div className="bg-[#DAD7B6] border border-[#9E9A83] p-4 text-[#4D4A44]">Loading listings…</div>}
                {error && <div className="bg-[#756F61] border border-[#4D4A44] p-4 text-[#FDFBEF]">{error}</div>}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map(l => {
                        const meta = agentMetas[l.tokenId];
                        return (
                            <Card key={l.id}>
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-[#2C2B28]">Agent #{l.tokenId}</div>
                                    <div className="text-sm text-[#756F61]">Seller: {l.seller.slice(0, 6)}…</div>
                                </div>
                                <div className="mt-3 text-sm">
                                    {meta ? (
                                        <>
                                            <div className="text-[#4D4A44]">Model: {meta.model || "N/A"}</div>
                                            <div className="text-[#4D4A44]">Capabilities: {meta.capabilities?.join(", ") || "N/A"}</div>
                                            <div className="text-[#4D4A44]">License: {meta.license || "N/A"}</div>
                                        </>
                                    ) : (
                                        <div className="text-[#8A8571]">Loading metadata…</div>
                                    )}
                                </div>
                                <div className="mt-5 flex items-center justify-between">
                                    <div className="text-lg font-semibold text-[#2C2B28]">
                                        {formatEther(BigInt(l.price))} ETH
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-[#4D4A44] text-[#FDFBEF] 
                                        hover:bg-[#2C2B28] transition-all duration-300
                                        disabled:opacity-50 disabled:cursor-not-allowed border border-[#756F61]"
                                        disabled={!address || isPending}
                                        onClick={() => onBuy(l.id, l.price)}
                                    >
                                        {isPending ? "Buying…" : "Buy"}
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
                
                {listings.length === 0 && !loading && (
                    <div className="bg-[#DAD7B6] border border-[#9E9A83] p-6 text-center text-[#4D4A44]">
                        No AI agents currently listed for sale
                    </div>
                )}
            </div>
        </div>
    );
}
