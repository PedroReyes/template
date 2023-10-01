import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import '@openzeppelin/hardhat-upgrades';
import dotenv from "dotenv";

dotenv.config();

const STAGING_PRIVATE_KEYS = [
  "99d7f2c155c73439815f7607d71e3c699233fe248f085afe52bd1f928343251d",
  "fc202655e550a25802648885249d2dcaca0cd3059ccd5d68dd081255b9e5e9f3",
  "b560db113b61e821791315d19b1c0039e7b2347b479fc3df67c7eac3c456e489"
]

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat", // default: "bscTestnet, hardhat"

  paths: {
    sources: "./src",
    tests: "./test",
    artifacts: "./artifacts",
    cache: "./cache",
  },

  mocha: {
    timeout: 640000,
  },

  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            // The more runs, the more expensive the deployment and cheaper the transactions
            // The less runs, the cheaper the deployment and the more expensive the transactions
            runs: 1000,
          },
        },
      },
    ],
  },

  networks: {
    hardhat: {
      loggingEnabled: false,
      // 👉 You can execute a local node with info from the
      // blockchain you want to fork by uncomment the next lines
      // `npx hardhat node` for running local node
      // url: "http://localhost:8545",
      // timeout: 520000,
      // 👉 For using the local node by default you have
      // to comment the forking section
      // forking: {
      //   // 👉 Using nodereal might have a cost (they have a free tier)
      //   enabled: true,
      //   // 💻 Mainnet fork
      //   url: "https://bsc-mainnet.blastapi.io/9c457fd9-f917-42ab-af42-a761815ca337",
      //   blockNumber: 27521097,
      //   // 💻 Testnet fork
      //   // url: "https://bsc-testnet.blastapi.io/9c457fd9-f917-42ab-af42-a761815ca337",
      //   // blockNumber: 27180987,
      // },
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_ID,
      accounts: STAGING_PRIVATE_KEYS,
      timeout: 120000,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.INFURA_ID,
      accounts: STAGING_PRIVATE_KEYS,
      timeout: 120000,
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + process.env.INFURA_ID,
      accounts: STAGING_PRIVATE_KEYS,
      timeout: 120000,
    },
    bscTestnet: {
      url: "https://bsc-testnet.blastapi.io/9c457fd9-f917-42ab-af42-a761815ca337",
      // url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      timeout: 240000,
      accounts: STAGING_PRIVATE_KEYS,
    },
    bscMainnet: {
      url: "https://bsc-mainnet.blastapi.io/9c457fd9-f917-42ab-af42-a761815ca337",
      // url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 56,
      gasPrice: 20000000000,
      timeout: 240000,
      accounts: STAGING_PRIVATE_KEYS,
    },
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      rinkeby: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      ropsten: process.env.ETHERSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "rinkeby",
        chainId: 4,
        urls: {
          apiURL: "https://api-rinkeby.etherscan.io/api",
          browserURL: "https://rinkeby.etherscan.io",
        },
      },
    ],
  },
};

export default config;

