// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./Box.sol";

/**
 * This BoxV2 keeps the storage of Box contract and adds a new "increment" function.
 */
contract BoxV2 is Box {
    // this should have the "initializer" modifier but it is not possible to override it
    // If you use it, you will get an exception when calling it like this one
    // Reason: 'execution reverted: Initializable: contract is already initialized'
    function migrationToV2() public payable {
        // "constructor" code...

        // Store 41 in the contract
        store(42);
    }

    // Increments the stored value by 1
    function increment() public {
        _value = _value + 1;
        emit ValueChanged(_value);
    }
}
