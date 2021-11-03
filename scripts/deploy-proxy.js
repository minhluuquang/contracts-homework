const hre = require("hardhat");
const { getImplementationAddress } = require("@openzeppelin/upgrades-core");

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const upgradableNFTMarket = await hre.upgrades.deployProxy(NFTMarket, {
    initializer: "initialize",
  });
  await upgradableNFTMarket.deployed();
  console.log(`Proxy nftMarket is deployed to: ${upgradableNFTMarket.address}`);

  const nftMarketImplAddress = await getImplementationAddress(
    upgradableNFTMarket.provider,
    upgradableNFTMarket.address
  );
  await hre.run("verify:verify", { address: nftMarketImplAddress });
  console.log(`NFTMarkezt implementation address: ${nftMarketImplAddress}`);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const upgradableNFT = await hre.upgrades.deployProxy(
    NFT,
    [upgradableNFTMarket.address],
    { initializer: "initialize" }
  );
  await upgradableNFT.deployed();
  console.log(`Proxy NFT is deployed to: ${upgradableNFT.address}`);

  const nftImplAddress = await getImplementationAddress(
    upgradableNFT.provider,
    upgradableNFT.address
  );
  await hre.run("verify:verify", { address: nftImplAddress });
  console.log(`NFT implementation address: ${nftImplAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
