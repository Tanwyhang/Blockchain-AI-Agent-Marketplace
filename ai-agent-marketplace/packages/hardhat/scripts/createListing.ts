import { ethers, deployments, getNamedAccounts, network } from "hardhat";

async function main() {
  console.log(`Network: ${network.name}`);

  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigner(deployer);

  const nftDeployment = await deployments.get("AI_Agent_NFT");
  const mktDeployment = await deployments.get("AI_Agent_Marketplace");

  const nft = await ethers.getContractAt("AI_Agent_NFT", nftDeployment.address, signer);
  const mkt = await ethers.getContractAt("AI_Agent_Marketplace", mktDeployment.address, signer);

  console.log("NFT:", nftDeployment.address);
  console.log("Marketplace:", mktDeployment.address);

  // 1) Temporarily set marketplace to deployer so we can mint directly
  console.log("Setting marketplace to deployer to mint...");
  const tx1 = await nft.setMarketplace(deployer);
  await tx1.wait();

  // 2) Mint an agent NFT to deployer
  const capabilities = ["code", "search", "trade"];
  console.log("Minting agent NFT...");
  const mintTx = await nft.mintAgent(
    deployer,
    "Alpha Agent",
    "General-purpose AI agent for coding and trading.",
    "LLM",
    capabilities,
    "https://example.com/license"
  );
  await mintTx.wait();
  const tokenId = await nft.totalMinted();
  console.log("Minted tokenId:", tokenId.toString());

  // 3) Restore marketplace address back to the real marketplace
  console.log("Restoring marketplace to:", mktDeployment.address);
  const tx2 = await nft.setMarketplace(mktDeployment.address);
  await tx2.wait();

  // 4) Approve marketplace for the token
  console.log("Approving marketplace for token", tokenId.toString());
  const approveTx = await nft.approve(mktDeployment.address, tokenId);
  await approveTx.wait();

  // 5) List the token for sale
  const price = ethers.parseEther("0.1");
  console.log("Listing token at price:", price.toString());
  const listTx = await mkt.listAgent(tokenId, price);
  await listTx.wait();

  // Try to read the nextListingId-1 as the listingId
  const nextId = await mkt.nextListingId();
  const listingId = nextId - 1n;
  console.log(`Listing created. listingId=${listingId.toString()}, tokenId=${tokenId.toString()}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
