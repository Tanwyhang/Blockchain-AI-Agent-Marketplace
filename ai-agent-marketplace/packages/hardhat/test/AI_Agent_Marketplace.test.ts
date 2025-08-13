import { expect } from "chai";
import { ethers } from "hardhat";

/**
 * Tests: AI_Agent_NFT + AI_Agent_Marketplace
 * - Happy path: mint -> list -> buy
 * - Edge: buy wrong price
 * - Edge: cancel by non-seller
 * - Edge: list without approval
 */

describe("AI_Agent Marketplace", function () {
  async function deployFixture() {
    const [deployer, seller, buyer, rando] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("AI_Agent_NFT");
    const nft = await NFT.deploy(ethers.ZeroAddress);
    await nft.waitForDeployment();

    const MKT = await ethers.getContractFactory("AI_Agent_Marketplace");
    const mkt = await MKT.deploy(await nft.getAddress());
    await mkt.waitForDeployment();

    await (await nft.connect(deployer).setMarketplace(await mkt.getAddress())).wait();

    return { deployer, seller, buyer, rando, nft, mkt };
  }

  it("happy path: mint, list, buy (escrowed)", async () => {
    const { seller, buyer, nft, mkt } = await deployFixture();

    // Mint via marketplace-only method: we simulate marketplace by calling NFT directly as seller? No, only marketplace can mint.
    // So we mimic marketplace mint by temporarily setting marketplace to seller for this test case then restoring? Better: owner is deployer, so setMarketplace to seller, mint, then set back to mkt.

    // Use owner to set marketplace to seller to allow minting for test setup
    const owner = (await nft.owner()) as unknown as string; // Ownable(msg.sender)
    // owner is deployer in fixture

    // Impersonate owner through signer - we already have deployer as owner in fixture
    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(seller.address)).wait();

    const mintTx = await nft.connect(seller).mintAgent(
      seller.address,
      "Agent One",
      "Help with tasks",
      "LLM",
      ["chat", "code"],
      "https://license.example/1"
    );
    const mintRc = await mintTx.wait();
    const tokenId = await nft.totalMinted();

    // Restore marketplace to real marketplace
    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(await mkt.getAddress())).wait();

    // Approve marketplace and list
    await (await nft.connect(seller).approve(await mkt.getAddress(), tokenId)).wait();
    const price = ethers.parseEther("1");
    const listTx = await mkt.connect(seller).listAgent(tokenId, price);
    const listRc = await listTx.wait();

    // Extract listingId from event (Listed)
    const listingId = (listRc?.logs?.[0] as any)?.args?.listingId ?? 1n;

    // Buy with exact price
    await expect(mkt.connect(buyer).buyListing(listingId, { value: price })).to.changeEtherBalances(
      [buyer, seller],
      [-price, price]
    );
    expect(await nft.ownerOf(tokenId)).to.eq(buyer.address);
  });

  it("reverts when wrong price sent", async () => {
    const { seller, buyer, nft, mkt } = await deployFixture();

    // Set marketplace to seller to mint
    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(seller.address)).wait();
    await (await nft.connect(seller).mintAgent(seller.address, "A", "B", "LLM", ["x"], "url")).wait();
    const tokenId = await nft.totalMinted();

    // Restore and approve, list
    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(await mkt.getAddress())).wait();
    await (await nft.connect(seller).approve(await mkt.getAddress(), tokenId)).wait();
    const price = ethers.parseEther("0.5");
    await (await mkt.connect(seller).listAgent(tokenId, price)).wait();

    await expect(mkt.connect(buyer).buyListing(1, { value: ethers.parseEther("0.1") })).to.be.revertedWith(
      "bad price"
    );
  });

  it("reverts when non-seller tries to cancel", async () => {
    const { seller, rando, nft, mkt } = await deployFixture();

    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(seller.address)).wait();
    await (await nft.connect(seller).mintAgent(seller.address, "A", "B", "LLM", ["x"], "url")).wait();
    const tokenId = await nft.totalMinted();
    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(await mkt.getAddress())).wait();

    await (await nft.connect(seller).approve(await mkt.getAddress(), tokenId)).wait();
    await (await mkt.connect(seller).listAgent(tokenId, ethers.parseEther("0.2"))).wait();

    await expect(mkt.connect(rando).cancelListing(1)).to.be.revertedWith("not seller");
  });

  it("reverts when listing without approval", async () => {
    const { seller, nft, mkt } = await deployFixture();

    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(seller.address)).wait();
    await (await nft.connect(seller).mintAgent(seller.address, "A", "B", "LLM", ["x"], "url")).wait();
    const tokenId = await nft.totalMinted();
    await (await nft.connect((await ethers.getSigners())[0]).setMarketplace(await mkt.getAddress())).wait();

    await expect(mkt.connect(seller).listAgent(tokenId, ethers.parseEther("0.2"))).to.be.revertedWith(
      "not approved"
    );
  });
});
