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

    // Deploying
    let contractName = "Box";
    const Box = await ethers.getContractFactory("Box");
    console.log('Deploying Box...');

    // Deploy proxy contract and initialize it
    const box = await upgrades.deployProxy(Box, [41], { initializer: 'initialize' });
    await box.waitForDeployment();
    let deployment = await box.deploymentTransaction()?.wait(1)
    let upgradableProxyAddress = await box.getAddress();
    let proxyAdminAddress = await (await upgrades.admin.getInstance()).getAddress();
    let contractImplementationAddress = await box.getAddress();

    console.log(`📖 Deployment hash: ${deployment?.hash}`);
    console.log("📖 Proxy admin:", proxyAdminAddress);
    console.log("📖 Upgradable proxy:", (upgradableProxyAddress));
    console.log(`📖 Box contract address: ${contractImplementationAddress}`);

    // Verify deployments
    if (VERIFY_DEPLOYMENTS && network != "hardhat") {
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
