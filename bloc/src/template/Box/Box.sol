// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

/// @title A simple box that can store a value.
/// @author Pedro Reyes
/// @notice Example of a simple box that can store a value.
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
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

    /**
     * @notice Updates the stored value and emits a ValueChanged event
     * @dev The caller must be the transparent upgradable proxy contract.
     * This restriction can be removed by removing the initializer modifier from the initialize function.
     * @param value the new value to store. It can hold non-negative whole numbers
     * ranging from 0 to 2^256-1.
     */
    function store(uint256 value) public {
        _value = value;
        emit ValueChanged(value);
    }

    /**
     * @notice Reads the last stored value
     *
     * @return the last stored value
     */
    function retrieve() public view returns (uint256) {
        return _value;
    }
}
