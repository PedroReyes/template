// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract Box is Initializable {
    uint256 internal _value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 value);

    // Constructor
    constructor() {
        // strategyContract = Strategy(msg.sender);
    }

    function initialize(uint256 initialValue) public payable initializer {
        // "constructor" code...

        store(initialValue);
    }

    // Stores a new value in the contract
    function store(uint256 value) public {
        _value = value;
        emit ValueChanged(value);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return _value;
    }
}
