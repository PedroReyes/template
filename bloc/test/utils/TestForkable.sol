// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

contract TestForkable is Test {
    //Access variables from .env file via vm.envString("varname")
    //Replace ALCHEMY_KEY by your alchemy key or Etherscan key, change RPC url if need
    //inside your .env file e.g:
    //MAINNET_RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/ALCHEMY_KEY'
    // string BSC_MAINNET_RPC_URL = vm.envString("FOUNDRY_MAINNET_RPC_URL");
    // string BSC_TESTNET_RPC_URL = vm.envString("BSC_TESTNET_RPC_URL");

    // the identifiers of the forks
    uint256 bscMainnetFork;
    uint256 bscTestnetFork;

    function setUp() public {
        bscMainnetFork = vm.createFork(vm.envString("FOUNDRY_BSC_MAINNET_RPC_URL"));
        bscTestnetFork = vm.createFork(vm.envString("FOUNDRY_BSC_TESTNET_RPC_URL"));

        console.log(
            "This is a forkable test, don't forget to implement setUpTest() function and select the fork using vm.selectFork(forkId)"
        );

        setUpTest();
    }

    // @PedroReyes
    // @NOTE: setUpTest Function for being implemented in the test
    function setUpTest() public virtual {}

    function selectBscMainnetFork() public {
        vm.selectFork(bscMainnetFork);
    }

    function selectBscTestnetFork() public {
        vm.selectFork(bscTestnetFork);
    }
}
