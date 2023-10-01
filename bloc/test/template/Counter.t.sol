// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../../src/template/Counter.sol";

// 📘 Forking mainnet: https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil
// Execution script:
// ✍ forge test -vvv --fork-url https://bsc-dataseed1.binance.org/ --match-contract Counter
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
contract CounterTest is Test {
    Counter public counter;

    function setUp() public {
        counter = new Counter();
        counter.setNumber(0);
    }

    function testIncrement() public {
        counter.increment();
        assertEq(counter.number(), 1);
    }

    function testSetNumber(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }
}
