# RipTix - Decentralized Ticketing with NFTs
![Alt text](<1 (1).png>)

## Overview
RipTix is a decentralized ticketing platform that leverages the power of Non-Fungible Tokens (NFTs) on the XRP EVM compatible chain. This project aims to revolutionize the event ticketing industry by introducing transparency, security, and uniqueness through blockchain technology.
![Alt text](2.png)

## Technology Stack & Tools
- Solidity (Smart Contract Development)
- JavaScript (React & Testing)
- Hardhat (Development Framework)
- Ethers (Blockchain Interaction)
- IPFS (Metadata Storage)
- React Routers (Navigational Components)

## Requirements For Initial Setup
1. Install NodeJS (compatible with any version below 16.5.0)
2. Install Hardhat

## Setting Up
1. **Clone/Download the Repository**
   ```bash
   $ git clone https://github.com/your-username/RipTix.git
   ```

2. **Install Dependencies**
   ```bash
   $ cd RipTix
   $ npm install
   ```

3. **Boot up Local Development Blockchain**
   ```bash
   $ cd RipTix
   $ npx hardhat node
   ```

4. **Connect Development Blockchain Accounts to Metamask**
   - Copy the private key of the addresses and import them into Metamask.
   - Connect Metamask to the Hardhat blockchain using the network `127.0.0.1:8545`.
   - If Hardhat is not added to the list of networks on Metamask, add it by entering "Hardhat" for the network name, "http://127.0.0.1:8545" for the new RPC URL, and "31337" for the chain ID.

5. **Migrate Smart Contracts**
   ```bash
   $ npx hardhat run src/backend/scripts/deploy.js --network localhost
   ```

6. **Run Tests**
   ```bash
   $ npx hardhat test
   ```

7. **Launch Frontend**
   ```bash
   $ npm run start
   ```