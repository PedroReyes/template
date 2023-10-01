// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./BoxV2.sol";

/**
 * This BoxV3 keeps the storage of Box and add the new method of BoxV2 contracts
 * without inheriting Box.
 */
contract BoxV3 is Initializable, BoxV2 {
    // Increments the stored value by 1
    function increment2() public {
        _value = _value + 2;
        emit ValueChanged(_value);
    }
}
