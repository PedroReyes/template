// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "./utils/TestForkable.sol";

// 📘 Forking mainnet: https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil
// Execution script:
// ✍ forge test -vvv --fork-url https://bsc-dataseed1.binance.org/ --match-contract NimbusRouterTest
// Or this one in case Foundry fixes the issue with coverage reports here https://github.com/foundry-rs/foundry/issues/4316
// ✍ forge test -vvv --fork-url https://bsc-dataseed1.binance.org/ && forge coverage --report lcov
//
// 📘 To see the HTML report locally you will have to run the next commands:
// 1. ✍ (bash console) forge coverage --report lcov
// 2. ✍ (powershell console) perl C:\ProgramData\chocolatey\lib\lcov\tools\bin\genhtml -o coverage\html lcov.info --branch-coverage
// You will need to follow the next tutorial to install genhtml in Windows:
// https://fredgrott.medium.com/lcov-on-windows-7c58dda07080
// It is basically install choco from powershell admin, after `choco install lcov` and then the command in step 2.
//
// Check here the asserting foundry book: https://book.getfoundry.sh/reference/ds-test?highlight=assertgt#asserting
// solhint-disable func-name-mixedcase
// solhint-disable no-console

interface NimbusRouter {
    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract NimbusRouterTest is TestForkable {
    // https://ioalabs.atlassian.net/wiki/spaces/NIMBUS2/pages/17467722/Binance+Smart+Chain#Router
    NimbusRouter public nimbusRouter;
    address public NIMBUS_ROUTER_CONTRACT = 0x2C6cF65f3cD32a9Be1822855AbF2321F6F8f6b24;

    // Tokens
    address public NIMB_BNB = 0xA2CA18FC541B7B101c64E64bBc2834B05066248b;
    address public NIMB = 0xCb492C701F7fe71bC9C4B703b84B0Da933fF26bB;

    // User input
    address public USER = 0xFC74D9B03352C92B6934321fd01128cB49505B74; // EOA - wallet address

    function setUpTest() public override {
        // select the fork
        selectBscMainnetFork();

        // Get the router contract
        nimbusRouter = NimbusRouter(NIMBUS_ROUTER_CONTRACT);
    }

    function testSwapExchangeRates() public {
        // Frontrunner attack ether amount
        uint256 ETHER_AMOUNT_ATTACK = 600 ether;

        // Send BNB to the walet address
        vm.deal(USER, ETHER_AMOUNT_ATTACK);

        // Start prank
        vm.startPrank(USER);

        // Create swap memory path
        address[] memory path = new address[](2);
        path[0] = NIMB_BNB;
        path[1] = NIMB;

        // Get amounts out for 1 BNB
        uint256[] memory amountsBefore = nimbusRouter.getAmountsOut(1 ether, path);

        // Assert that the amount of NIMB tokens is greater than 0
        assertGt(amountsBefore[1], 0);

        // Logging the amountsBefore
        console.log("BNB: ", amountsBefore[0]);
        console.log("NIMB: ", amountsBefore[1]);

        // Create swap memory path
        address[] memory pathReverse = new address[](2);
        pathReverse[0] = path[1];
        pathReverse[1] = path[0];

        // Swap BNB for NIMB - ETHER_AMOUNT_ATTACK
        nimbusRouter.swapExactTokensForTokens(ETHER_AMOUNT_ATTACK, 0, pathReverse, USER, block.timestamp + 15);

        // Get amounts out for 1 BNB
        uint256[] memory amountsAfter = nimbusRouter.getAmountsOut(1 ether, path);

        // Assert that the amount of NIMB tokens is greater than 0
        assertGt(amountsAfter[1], 0);

        // Logging the amountsAfter
        console.log("BNB: ", amountsAfter[0]);
        console.log("NIMB: ", amountsAfter[1]);

        // Check the difference between the amountsBefore and amountsAfter
        assertGt(amountsAfter[1], amountsBefore[1]);
        console.log("Difference: ", amountsAfter[1] - amountsBefore[1]);

        // Purchasing the NFT
        // . . .

        // Did the user got the amount of NIMB in his NFT as it was promised according to the exchange rate?
        // If yes, then the slippage works!
        // If no, then we have to find another solution . . .

        // Swap NIMB for BNB - ETHER_AMOUNT_ATTACK
        // . . .

        vm.stopPrank();
    }
}
