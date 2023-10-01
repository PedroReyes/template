// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../../src/template/Counter.sol";

// https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil
// 📘 To get a localhost blockchain with BSC mainnet forked:
// ✍ anvil --fork-url https://bsc-dataseed1.binance.org/
//
// 📘 To get the balance of a NIMB token in the BSC mainnet:
// ✍ cast call 0xcb492c701f7fe71bc9c4b703b84b0da933ff26bb "balanceOf(address)(uint256)" 0xd72dbaecd95892694fd1e62a9c3023d9a692ef12
//
// 📘 Let's send some ether to our private key address (https://book.getfoundry.sh/reference/cast/cast-send):
// ✍ cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0xd299d4C11A1FA966a2E97B89e03DA42029c61152 --value 1.5ether
//
// 📘 Check ether balance to our deployer address:
// ✍ cast balance 0xd299d4C11A1FA966a2E97B89e03DA42029c61152
//
// 📘 To deploy our Counter smart contract in the local blockchain forked:
// ❌ This last step is giving me an error
// ✍ forge script scripts/template/Counter.s.sol:CounterScript --broadcast --fork-url http://localhost:8545
//
// 📘 Verifying the smart contract in BSCScan:
// ✍ forge verify-contract --verifier-url https://api-testnet.bscscan.com/api --etherscan-api-key <API_KEY> <ADDRESS> Counter
contract CounterScript is Script {
    function setUp() public {}

    // function run() public {
    //     vm.broadcast();
    // }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        console.log("deployerPrivateKey: %s", deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        Counter counter = new Counter();

        vm.stopBroadcast();
    }
}
