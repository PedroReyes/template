// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * ✍ Script for deploying this strategy
 * 
 * $ npx hardhat run scripts/template/MultiSender.ts --network bscTestnet
 */
contract MultiSender {
    using Address for address;
    using SafeERC20 for IERC20;

    constructor() {}

    function sendTokens(address _contract, address[] calldata _recepients, uint256[] calldata _amounts, uint256 _total)
        public
    {
        require(_contract != address(0), "Zero address is prohibited");
        require(_contract.isContract(), "Provided address is not a contract");
        require(_total > 0, "Total amount of tokens must not be zero");
        require(_recepients.length == _amounts.length, "Array of recepients and array amounts have different length");
        uint256 totalChecksum = 0;
        for (uint256 i = 0; i < _amounts.length;) {
            totalChecksum += _amounts[i];
            unchecked {
                ++i;
            }
        }
        require(totalChecksum == _total, "Sum of amounts array is not equal with total amount of tokens required");
        IERC20 token = IERC20(_contract);
        uint256 balance = token.balanceOf(msg.sender);
        require(balance >= _total, "Sender balance is lower than total amount of tokens required");
        require(
            token.allowance(msg.sender, address(this)) >= _total, "Amount of tokens to send is higher than allowance"
        );
        for (uint256 i = 0; i < _recepients.length;) {
            token.safeTransferFrom(msg.sender, _recepients[i], _amounts[i]);
            unchecked {
                ++i;
            }
        }
    }
}
