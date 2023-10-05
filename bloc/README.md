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

# How to launch a new release

To launch a new release, you need to create a new branch from up-to-date staging branch. The branch name should be `release/vX.Y.Z` where `X.Y.Z` is the version of the release. The branch should contain the following changes:

- [ ] Update the version in `package.json` and `package-lock.json` files.
- [ ] Update the version in `README.md` file.
- [ ] A folder within the `release` folder with the name of the release and an index file with a content similar to following:

```bash
# Release vX.Y.Z
title: Deploying Box using Hardhat
network: bscTestnet
deploy: npx hardhat run scripts/template/Box/deployBox.ts
verify: verify-deployed
finish: propose-upgrade
audited: 85b015631800346159d10bf389e36a0304447d0b
description: |
  🤖 Comments just for testing
  🤖 Comments just for testing
  🤖 Comments just for testing
  🤖 Comments just for testing
```

- [ ] A `deploy.ts` file within the `release/vX.Y.Z` folder
