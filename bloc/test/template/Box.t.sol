//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.18;

// solhint-disable no-global-import
import "forge-std/Test.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../../src/template/Box/Box.sol";
import "../../src/template/Box/BoxV2.sol";
import "../../src/template/Box/BoxV3.sol";
import "./../utils/TestForkable.sol";

// 📘 Forking mainnet: https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil
// Test execution script for all the test suite:
// ✍ forge test -vvv --fork-url https://data-seed-prebsc-1-s3.binance.org:8545/ --match-contract BoxTest
//
// Text execution script for specific test case:
// ✍ forge test -vvv --fork-url https://data-seed-prebsc-1-s3.binance.org:8545/ --match-contract ______ --match-test test_______
//
// Or this one in case Foundry fixes the issue with coverage reports here https://github.com/foundry-rs/foundry/issues/4316
// ✍ forge test -vvv --fork-url https://data-seed-prebsc-1-s3.binance.org:8545/ && forge coverage --report lcov
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
interface Events {
// event NewDeposit(address indexed user, uint256 amount, uint256 fee);
}

contract BoxTest is TestForkable, Events {
    // 📘 Strategy contract
    address payable public BOX_TRANSPARENT_PROXY_UPGRADABLE_ADDRESS =
        payable(0xf17EAFCb9b06C792e2321cdA49D702f9BA3A98e6);
    TransparentUpgradeableProxy public transparentProxy;

    address public BOX_PROXY_ADMIN_ADDRESS = 0x80A74686d4BB0C49283fb8CF6fe91E50b04ab58A;

    Box public boxContract;
    // Box V1: https://testnet.bscscan.com/address/0xa7b211f45c99780e35d9027af59a758ac44f4713#code
    // Box V2:

    // 📘 Users
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public trudy = makeAddr("trudy");
    address public james = makeAddr("james"); // James is special, he is not provided with any resources in the setup

    // 📘 Tokens
    address public constant WBNB_PANCAKESWAP_ADDRESS = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address public constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant BUSD_ADDRESS = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address public constant WBNB_NIMBUS_ADDRESS = 0xA2CA18FC541B7B101c64E64bBc2834B05066248b;

    // General deposit from users in NIMB tokens
    uint256 public constant NIMB_DEPOSIT_AMOUNT = 1000 ether;

    // General deposit in ether
    uint256 public constant ONE_ETHER = 1 ether;

    // Time lapse
    uint256 public constant ONE_YEAR = 365 days;

    function setUpTest() public override {
        // Select the fork
        selectBscTestnetFork();

        // 📘 Deploy the strategy contract
        boxContract = Box(BOX_TRANSPARENT_PROXY_UPGRADABLE_ADDRESS);

        // 📘 Call the initialize function
        // boxContract.initialize(100);

        transparentProxy = TransparentUpgradeableProxy(BOX_TRANSPARENT_PROXY_UPGRADABLE_ADDRESS);
    }

    // 📖 Test
    function test_Initialize() public {
        console.log("Initial test 1 . . . ");
        console.log("boxContract.retrieve() = %s", boxContract.retrieve());

        // Assert that the value is 41
        assertEq(boxContract.retrieve(), 41, "The value is not 100");
    }

    // 📖 Test
    function test_Store() public {
        console.log("Initial test 2 . . . ");
        console.log("before store - boxContract.retrieve() = %s", boxContract.retrieve());

        // Store a new value
        boxContract.store(200);

        // Assert that the value is 200
        assertEq(boxContract.retrieve(), 200, "The value is not 200");
        console.log("after store - boxContract.retrieve() = %s", boxContract.retrieve());
    }

    // 📖 Test
    function test_Upgrade_BoxV3() public {
        console.log("Initial test 3 . . . ");
        console.log("boxContract.retrieve() = %s", boxContract.retrieve());

        // Store current value
        uint256 currentValue = boxContract.retrieve();

        // Create a new Box contract
        BoxV3 boxV3 = new BoxV3();

        // Create current upgradable contracts
        ProxyAdmin proxyAdmin = ProxyAdmin(BOX_PROXY_ADMIN_ADDRESS);

        // Get owner of proxyAdmin
        address proxyAdminOwner = proxyAdmin.owner();

        // Start prank with the owner of the proxyAdmin
        vm.startPrank(proxyAdminOwner);

        // Upgrade the contract
        proxyAdmin.upgrade(transparentProxy, address(boxV3));

        // Upgrade the box contract
        BoxV3 boxContractV3 = BoxV3(address(BOX_TRANSPARENT_PROXY_UPGRADABLE_ADDRESS));

        // Increment the value with the new function in the boxV contract
        boxContractV3.increment2();

        // Log current value
        console.log("boxContractV3.retrieve() = %s", boxContractV3.retrieve());

        // Assert that the value is incremented by 1
        assertEq(boxContractV3.retrieve(), currentValue + 2, "The value is not 42");

        // Stop prank
        vm.stopPrank();
    }
}
