// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "../../../src/template/Box/Box.sol";
import "../../../src/template/Box/BoxV3.sol";

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
// ✍ forge script scripts/template/Box/BoxUpgradeV3.s.sol:BoxUpgradeScript --fork-url http://localhost:8545 --broadcast
// ✍ forge script scripts/template/Box/BoxUpgradeV3.s.sol:BoxUpgradeScript --broadcast
contract BoxUpgradeScript is Script {
    // 📘 Strategy contract
    address payable public BOX_TRANSPARENT_PROXY_UPGRADABLE_ADDRESS =
        payable(0xf17EAFCb9b06C792e2321cdA49D702f9BA3A98e6);

    TransparentUpgradeableProxy public transparentProxy;
    address public BOX_PROXY_ADMIN_ADDRESS = 0x80A74686d4BB0C49283fb8CF6fe91E50b04ab58A;

    Box public boxContract;

    function setUp() public {}

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        console.log("deployerPrivateKey: %s", deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        // Create a new transparent proxy
        transparentProxy = TransparentUpgradeableProxy(BOX_TRANSPARENT_PROXY_UPGRADABLE_ADDRESS);

        // Create current upgradable contracts
        boxContract = Box(BOX_TRANSPARENT_PROXY_UPGRADABLE_ADDRESS);

        // Create current upgradable contracts
        ProxyAdmin proxyAdmin = ProxyAdmin(BOX_PROXY_ADMIN_ADDRESS);

        // Get owner of proxyAdmin
        address proxyAdminOwner = proxyAdmin.owner();

        console.log(proxyAdminOwner);

        if (true) {
            // Create a new Box contract
            BoxV3 boxV3 = new BoxV3();

            // Upgrade the contract
            proxyAdmin.upgrade(transparentProxy, address(boxV3));
        }

        vm.stopBroadcast();
    }
}
