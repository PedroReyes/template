# Template

Run the next commands to have a workable git repository:

```bash
$ node .github/.husky/setup-template.mjs
```

Or you can separately run each command to verify that you have a workable environment:

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

If the above works, then you are ready to start developing your own contracts. However, bear in mind to follow the guidance of the next sections.

## Developer guidance - How to work with branches

If you have a new task called `TASK-0001 Description here of an important task for my project`, then you should create a new branch fully updated from the `staging` branch using the task ID:

```bash
$ git checkout staging
$ git pull origin staging
$ git checkout -b TASK-0001
```

Take into account that `TASK` should be something like the `Jira Shortcut` of your project. Then, you should commit your changes to the branch:

```bash
$ git add .
$ git commit -m "TASK-0001 Description here of an important task for my project"
$ git commit --amend --no-edit && git push origin TASK-0001 --force # If you need to modify the last commit
```

In case you want to modify the last commit, then you should use the `--amend` and `--no-edit` flags. However, you can always do the squash at the end of the task so that you can have a cleaner history of commits.

````bash
$ git add .
$ git commit --amend --no-edit
$ git push origin TASK-0001 --force
```

Please, if your changes need to deployed to the blockchain, then you will have to modify the `bloc/release/next_release/` folder with the code needed to deploy your changes and to verify them. Check the `bloc/release/template/` folder to see an example of how to do it. These files will be used by the GitHub Actions workflow to deploy your changes to the blockchain. Make sure that your changes are working properly before pushing them to the repository in a hardhat (mandatory), bscTestnet (mandatory), and bscMainnet (if possible) environment.

Then, you should push your changes to the branch:

```bash
$ git push origin TASK-0001
````

When you are done with your task, in order keep the `staging` branch clean, squash your commits into a single one:

```bash
$ git checkout TASK-0001 # If you are not in the branch
$ git pull origin staging # If you are not up to date
$ git reset --mixed HEAD~2 # The following command will remove the last 2 commits, the local repo will be as if the content of the last 2 commits was done on the workspace, but neither added nor committed to the index, including the merge content. At this step, git status may show more modifications than the actual work you did because it is comparing the state of your branch (your code + new changes on staging) to the last commit on the branch. Don't panic!
$ git add --all . # Stash the changes and then apply them back.
$ git stash
$ git rebase staging # Make the branch start from the latest staging commit
$ git stash apply # Apply the stashed changes. Now with git diff/status you should see only the changes you made on the branch.
$ git add .
$ git commit -m "TASK-0001 Description here of an important task for my project"
$ git push origin TASK-0001 --force
```

Then, you should create a pull request to the `staging` branch. The pull request should have the following name:

```bash
TASK-0001 Description here of an important task for my project
```

Then, you should wait or ask a colleague for the pull request to be reviewed and merged to the `staging` branch.

## GitHub Actions - Deploying smart contracts

You will need to give contents-permission of the default GITHUB_TOKEN to true. (Required to push new commits to the repository). The URL is like this one: https://github.com/PedroReyes/template/settings/actions. This is needed because the GitHub Actions workflow will push the artifacts to the repository.

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
