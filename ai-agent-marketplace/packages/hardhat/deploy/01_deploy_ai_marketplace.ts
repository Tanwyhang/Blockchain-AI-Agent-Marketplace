import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  // 1) Deploy NFT with no marketplace initially
  const nft = await deploy("AI_Agent_NFT", {
    from: deployer,
    args: ["0x0000000000000000000000000000000000000000"],
    log: true,
    autoMine: true,
  });

  // 2) Deploy Marketplace pointing to NFT
  const mkt = await deploy("AI_Agent_Marketplace", {
    from: deployer,
    args: [nft.address],
    log: true,
    autoMine: true,
  });

  // 3) Set marketplace in NFT
  const nftContract = await hre.ethers.getContractAt("AI_Agent_NFT", nft.address, await hre.ethers.getSigner(deployer));
  const tx = await nftContract.setMarketplace(mkt.address);
  await tx.wait();
  log(`➡️  NFT marketplace set to ${mkt.address}`);
};

export default func;
func.tags = ["AI_Agent_Marketplace", "AI_Agent_NFT"]; 
