# Template

Run the next commands to have a workable git repository:

```bash
$ node .github/.husky/setup-template.mjs
```

Run the next commands to verify that you have a workable environment:

```bash
$ npm install
$ npm run prepare
$ cd bloc
$ npm install
$ forge install
$ forge update
$ forge remappings
$ npx hardhat test
$ npm install
$ rm -rf artifacts/ cache cache_forge/ out/
$ npx hardhat test
$ forge test
$ npx hardhat run scripts/template/Box/deployBox.ts
$ forge script scripts/template/Counter.s.sol:CounterScript --broadcast
$ forge script scripts/template/Box/BoxUpgradeV3.s.sol:BoxUpgradeScript --broadcast --fork-url https://bsc-testnet.blastapi.io/9c457fd9-f917-42ab-af42-a761815ca337
```

If the above works, then you are ready to start developing your own contracts.

You will need to give contents-permission of the default GITHUB_TOKEN to true. (Required to push new commits to the repository). The URL is like this one: https://github.com/PedroReyes/template/settings/actions

## Deploying to the testnet

To deploy to the testnet, you need to create a `.env` file in the root directory of the project. The file should contain the following:

```bash
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
```
