const { upgrades, ethers } = require("hardhat");
const { getImplementationAddress } = require("@openzeppelin/upgrades-core");

async function main() {
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const upgradableNFTMarket = await upgrades.upgradeProxy(
    "0x83bDa3B6E54A082F1d637555B9a5bfB4Ad892099",
    NFTMarket
  );
  console.log(`Proxy nftMarket is deployed to: ${upgradableNFTMarket.address}`);

  const nftMarketImplAddress = await getImplementationAddress(
    upgradableNFTMarket.provider,
    upgradableNFTMarket.address
  );
  // console.log(`NFTMarket implementation address: ${nftMarketImplAddress}`);
  // await run("verify:verify", { address: nftMarketImplAddress });

  const NFT = await ethers.getContractFactory("NFT");
  const upgradableNFT = await upgrades.upgradeProxy(
    "0x8af15222f1714Eb5761BCc2E49e2D52ab0dDEEAB",
    NFT,
    [nftMarketImplAddress]
  );
  console.log(`Proxy NFT is deployed to: ${upgradableNFT.address}`);

  // const nftImplAddress = await getImplementationAddress(
  //   upgradableNFT.provider,
  //   upgradableNFT.address
  // );
  // console.log(`NFT implementation address: ${nftImplAddress}`);
  // await run("verify:verify", { address: nftImplAddress });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
