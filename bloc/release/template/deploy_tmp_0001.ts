// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

/**
* ✍ Script for tasks that do not deploy contracts
* $ npx hardhat run scripts/template/Box/deployBox.ts --network bscTestnet
*/
var path = require("path");

export async function mainTMP0001_Deployment() {
    var scriptName = path.basename(__filename);
    console.log("======================================");
    console.log(`🔁 Executing ${scriptName}`);
    console.log("======================================");
    console.log("✍  Tasks solved in this script:\n");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("*️⃣  TMP-0000: Template for deploying a contract");
    console.log("\n\n\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (false) {
    mainTMP0001_Deployment().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}