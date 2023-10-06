// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { mainTMP0000_Deployment } from "./deploy_tmp_0000";
import { mainTMP0001_Deployment } from "./deploy_tmp_0001";

/**
✍ Script for deploying this strategy

$ npx hardhat run release/next_release/deploy.ts --network bscTestnet
*/
async function main() {
    await mainTMP0000_Deployment();
    await mainTMP0001_Deployment();
    // . . . await mainTMP000"X"();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
