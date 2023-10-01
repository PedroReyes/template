import { execSync } from "node:child_process";
import { exit } from "node:process";

const processName = "Setup Template Hook";

// --------------------------------------------------------------------------------------------------------
// 📖 Execution message
// --------------------------------------------------------------------------------------------------------
console.log(`🔄 ${processName} execution in progress!`);

// --------------------------------------------------------------------------------------------------------
// 📖 Running process
// --------------------------------------------------------------------------------------------------------
if (false) {
  // Init git repository
  if (!executeCommand(`git status`, false)) {
    executeCommand(`git init && git add . && git commit -m "Initial commit"`);
  }

  // Install dependencies
  executeCommand(`npm install`);
  executeCommand(`cd bloc && npm install`);

  // Install husky (only Windows systems)
  executeCommand(`npm run prepare`);

  // Run hardhat tests
  executeCommand(`cd bloc && npx hardhat test`);

  // Run foundry tests
  executeCommand(`cd bloc && forge test`);

  // Run hardhat deployments (simulation)
  executeCommand(
    `cd bloc && npx hardhat run scripts/template/Box/deployBox.ts`
  );

  // Run foundry deployments (simulation)
  executeCommand(
    `cd bloc && forge script scripts/template/Counter.s.sol:CounterScript --broadcast`
  );
}

console.log(
  "\n🐵 All is setup and ready to push this template project to GitHub 🐵\n",
  "🐵 Remember to push the repository with the next commands: 🐵\n",
  "🐵 $ git remote add origin git@github.com:PedroReyes/template.git 🐵\n",
  "🐵 $ git push -u origin main 🐵\n",
  "🐵 You will need to add a secret called ENV_FILE containing the .env file. See example: 🐵\n",
  `
# 💻 Network explorers
BSCSCAN_API_KEY=89IM25...35XJ2A
ETHERSCAN_API_KEY=4EGGI...T2X7YA3
INFURA_ID=8e1f...HK349
REPORT_GAS=true
ARCHIVE_NODE_API_KEY=84837...24HJ3
PRIVATE_KEY=0x99d7f2c...09d3a

# 📦 Contracts testing in Foundry
FOUNDRY_BSC_MAINNET_RPC_URL=https://bsc-mainnet.blastapi.io/...
FOUNDRY_BSC_TESTNET_RPC_URL=https://bsc-testnet.blastapi.io/...
`
);

// --------------------------------------------------------------------------------------------------------
// 📖 Execution success message
// --------------------------------------------------------------------------------------------------------
console.log(`✅ ${processName} executed successfully!`);

/**
 * Executes a command in the terminal
 *
 * @param {*} command
 * @param {*} successMessage
 * @param {*} errorMessage
 */
function executeCommand(command, exitOnError = true, successMessage) {
  try {
    console.log(`\n🤖 Executing command: ${command}`);

    execSync(command, {
      stdio: "inherit",
      encoding: "utf8",
    });

    console.log(`\n${successMessage ?? "✅ " + command + " succeeded ✅"}`);

    return true;
  } catch (e) {
    console.log(`\n❗⛔ ${command} failed ⛔❗`);
    console.log(e);
    if (exitOnError) {
      exit();
    } else {
      return false;
    }
  }
}
