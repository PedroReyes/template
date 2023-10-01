// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

/**
✍ Script for deploying this strategy

$ npx hardhat run scripts/template/Box/upgradeBoxV2.ts --network bscTestnet
*/

import { ethers, upgrades } from "hardhat";
import hre from "hardhat";
import { verifyDeploymentWithContract } from "../../utils/deployment";
var path = require("path");

// 📌 Constants
const VERIFY_DEPLOYMENTS: boolean = true;

async function main() {
  var scriptName = path.basename(__filename);
  let step = 1;
  console.log(`🔁 Executing ${scriptName}`, 1);

  // 💻 Network
  let network = hre.network.name;
  console.log(`💻 Network: ${network}`);

  // 🤓 EOA - Addresses
  let [deployer] = await ethers.getSigners();

  // 🔊 EOAs
  console.log(`🤓 Deployer: ${deployer.address}`);

  // Upgrade proxy contract 
  let contractName = "Box";
  let strategyNameVersion = `${contractName}V2`;
  let proxyAddress = "0xf17EAFCb9b06C792e2321cdA49D702f9BA3A98e6";
  const BoxV2 = await ethers.getContractFactory(strategyNameVersion);
  console.log('Upgrading to BoxV2...');
  let strategyContractUpgrade = await upgrades.upgradeProxy(proxyAddress, BoxV2);

  // Get address
  let contractAddress = await strategyContractUpgrade.getAddress();
  console.log(`Box upgraded to: ${contractAddress}`);

  // Verify deployments
  if (VERIFY_DEPLOYMENTS) {
    // ✍ Verify Strategy
    await verifyDeploymentWithContract(hre, contractName, contractAddress, []);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
