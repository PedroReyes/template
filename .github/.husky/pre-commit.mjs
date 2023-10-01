import { execSync } from "node:child_process";
import { exit } from "node:process";

// --------------------------------------------------------------------------------------------------------
// 📖 Pre-commit hook execution message
// --------------------------------------------------------------------------------------------------------
console.log("🔄 Pre-commit hook execution in progress!");

// --------------------------------------------------------------------------------------------------------
// 📖 Running pre-checks
// --------------------------------------------------------------------------------------------------------
// Run hardhat tests
try {
  execSync(`cd bloc && npx hardhat test`, {
    stdio: "inherit",
    encoding: "utf8",
  });

  console.log("\n✅ Hardhat tests succeeded ✅");
} catch (e) {
  console.log("\n❗⛔ Hardhat tests failed in client ⛔ ❗");
  console.log(e);
  exit();
}

// Run foundry tests
try {
  execSync(`cd bloc && forge test`, {
    stdio: "inherit",
    encoding: "utf8",
  });

  console.log("\n✅ Foundry tests succeeded ✅");
} catch (e) {
  console.log("\n❗⛔ Foundry tests failed in client ⛔ ❗");
  console.log(e);
  exit();
}

// --------------------------------------------------------------------------------------------------------
// 📖 Pre-commit hook execution success message
// --------------------------------------------------------------------------------------------------------
console.log("✅ Pre-commit hook executed successfully!");
