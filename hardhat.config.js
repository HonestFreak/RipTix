require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    xrplEvmSidechain: {
      url: "https://rpc-evm-sidechain.xrpl.org",
      chainId: 1440002,
      accounts: {
        mnemonic: ""  // mnemonic of the account that will deploy the contracts
      }
    },
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};




