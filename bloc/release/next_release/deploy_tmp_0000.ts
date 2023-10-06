// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

/**
* ✍ Script for deploying contracts
* 
* $ npx hardhat run scripts/template/Box/deployBox.ts --network bscTestnet
*/

import { ethers, upgrades } from "hardhat";
import hre from "hardhat";
import { addDeployment, getContractField, verifyDeploymentWithContract } from "../../scripts/utils/deployment";
var path = require("path");

let CONTRACT_NAME = "Box";

export async function mainTMP0000_Deployment() {
    var scriptName = path.basename(__filename);
    console.log("======================================");
    console.log(`🔁 Executing ${scriptName}`);
    console.log("======================================");
    console.log("✍  Tasks solved in this script:\n");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("\n")

    // 💻 Network
    let network = hre.network.name;
    console.log(`💻 Network: ${network}`);

    // 🤓 EOA - Addresses
    let [deployer] = await ethers.getSigners();

    // 🔊 EOAs
    console.log(`🤓 Deployer: ${deployer.address}`);

    // 📘 Deploying
    const Box = await ethers.getContractFactory(CONTRACT_NAME);
    console.log(`Deploying ${CONTRACT_NAME}...`);

    // 🚀 Deploy proxy contract and initialize it
    const boxContract = await upgrades.deployProxy(Box, [41], { initializer: 'initialize' });
    await boxContract.waitForDeployment();

    // 📝 Get deployment data
    let deploymentReceipt = await boxContract.deploymentTransaction()?.wait(1)
    let upgradableProxyAddress = await boxContract.getAddress();
    let proxyAdminAddress = await (await upgrades.admin.getInstance()).getAddress();
    let transactionHash = deploymentReceipt?.hash;
    let contractABI = Box.interface.format();
    const currentImplAddress = await upgrades.erc1967.getImplementationAddress(upgradableProxyAddress);

    // 📑 Logs
    console.log(`📖 Deployment hash: ${deploymentReceipt?.hash}`);
    console.log("📖 Proxy admin:", proxyAdminAddress);
    console.log("📖 Upgradable proxy:", (upgradableProxyAddress));
    console.log(`📖 Box contract address: ${currentImplAddress}`);
    console.log(`📖 Box ABI: ${contractABI}`);

    // ===================================================
    // Add deployment to deployments.json (mandatory ❗)
    // ===================================================
    await addDeployment(
        network,
        CONTRACT_NAME,
        boxContract,
        contractABI,
        transactionHash
    );

    console.log("\n\n\n");
}

export async function mainTMP0000_Verify() {
    // 💻 Network
    let network = hre.network.name;
    console.log(`💻 Network: ${network}`);

    // ===================================================
    // Verify deployments (mandatory ❗)
    // ===================================================
    if (network != "hardhat") {
        // Leaving a few seconds to etherscan to index the contract
        console.log(`\n⏳ Waiting 30 seconds for etherscan to index the contract...\n`);
        await new Promise(r => setTimeout(r, 30000));

        // 📘 Getting address for contract
        const contractAddress = getContractField(network, CONTRACT_NAME, "address");

        // ✍ Verify Strategy
        await verifyDeploymentWithContract(hre, CONTRACT_NAME, contractAddress, []);
    }

    console.log("\n\n\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (false) {
    mainTMP0000_Deployment().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}