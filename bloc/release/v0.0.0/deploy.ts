// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

/**
✍ Script for deploying this strategy

$ npx hardhat run scripts/template/Box/deployBox.ts --network bscTestnet
*/

import { ethers, upgrades } from "hardhat";
import hre from "hardhat";
import { addDeployment, verifyDeploymentWithContract } from "../../scripts/utils/deployment";
import { getContractAddress } from "@openzeppelin/hardhat-upgrades/dist/utils";
var path = require("path");

// 📌 Constants
const VERIFY_DEPLOYMENTS: boolean = true;

async function main() {
    var scriptName = path.basename(__filename);
    console.log(`🔁 Executing ${scriptName}`);

    // 💻 Network
    let network = hre.network.name;
    console.log(`💻 Network: ${network}`);

    // 🤓 EOA - Addresses
    let [deployer] = await ethers.getSigners();

    // 🔊 EOAs
    console.log(`🤓 Deployer: ${deployer.address}`);

    // Deploying
    let contractName = "Box";
    const Box = await ethers.getContractFactory(contractName);
    console.log('Deploying Box...');

    // Deploy proxy contract and initialize it
    const boxContract = await upgrades.deployProxy(Box, [41], { initializer: 'initialize' });
    await boxContract.waitForDeployment();
    let deploymentReceipt = await boxContract.deploymentTransaction()?.wait(1)
    let upgradableProxyAddress = await boxContract.getAddress();
    let proxyAdminAddress = await (await upgrades.admin.getInstance()).getAddress();
    let transactionHash = deploymentReceipt?.hash;
    let contractABI = Box.interface.format();
    let contractAddress = await getContractAddress(proxyAdminAddress);
    const currentImplAddress = await upgrades.erc1967.getImplementationAddress(upgradableProxyAddress);

    console.log(`📖 Deployment hash: ${deploymentReceipt?.hash}`);
    console.log("📖 Proxy admin:", proxyAdminAddress);
    console.log("📖 Upgradable proxy:", (upgradableProxyAddress));
    console.log(`📖 Box contract address: ${currentImplAddress}`);
    console.log(`📖 Box ABI: ${contractABI}`);

    // Add deployment to deployments.json
    await addDeployment(
        network,
        contractName,
        boxContract,
        contractABI,
        transactionHash
    );

    // Verify deployments
    if (VERIFY_DEPLOYMENTS && network != "hardhat" && false) {
        // Leaving a few seconds to etherscan to index the contract
        console.log(`\n⏳ Waiting 30 seconds for etherscan to index the contract...\n`);
        await new Promise(r => setTimeout(r, 30000));

        // ✍ Verify Strategy
        await verifyDeploymentWithContract(hre, contractName, upgradableProxyAddress, []);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
