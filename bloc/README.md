# Setup

To make sure you can start working on the project, you need to install Foundry in your PC and afterwards run the following commands:

```bash
npm install
rm -rf artifacts/ cache cache_forge/ out/
npx hardhat test
forge test
npx hardhat run scripts/template/Box/deployBox.ts
forge script scripts/template/Counter.s.sol:CounterScript --broadcast
forge script scripts/template/Box/BoxUpgradeV3.s.sol:BoxUpgradeScript --broadcast --fork-url https://bsc-testnet.blastapi.io/9c457fd9-f917-42ab-af42-a761815ca337
```
