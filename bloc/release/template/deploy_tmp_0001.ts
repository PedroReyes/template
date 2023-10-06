// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

/**
✍ Script for deploying this strategy

$ npx hardhat run scripts/template/Box/deployBox.ts --network bscTestnet
*/
var path = require("path");

// 📌 Constants
const VERIFY_DEPLOYMENTS: boolean = true;

export async function mainTMP0001() {
    var scriptName = path.basename(__filename);
    console.log(`🔁 Executing ${scriptName}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (false) {
    mainTMP0001().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}