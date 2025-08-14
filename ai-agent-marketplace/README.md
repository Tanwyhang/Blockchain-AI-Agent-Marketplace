# 🤖 AI Agent Marketplace

A decentralized marketplace for buying and selling AI agents built on Ethereum using Scaffold-ETH 2.

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> | 
  <a href="https://scaffoldeth.io">Website</a> 
</h4>

🧪 A specialized dApp for trading AI agents as NFTs on the Ethereum blockchain. Users can mint, list, and purchase AI agents with various capabilities and models.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

## Features

- 🤖 **AI Agent NFTs**: Mint unique AI agents with specific models, capabilities, and licenses
- 🛒 **Marketplace**: Buy and sell AI agents in a decentralized marketplace
- 💰 **ETH Payments**: All transactions are handled in ETH
- 📊 **The Graph Integration**: Efficient querying of marketplace data
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/get-docker/) (for The Graph integration)

## 🚀 Getting Started

Follow these steps to run the AI Agent Marketplace locally:

### 1. Install Dependencies

```bash
git clone <your-repo-url>
cd ai-agent-marketplace
yarn install
```

### 2. Start Local Blockchain

In your first terminal, start a local Ethereum network:

```bash
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

**Keep this terminal running!** 🔥

### 3. Deploy Smart Contracts

In a second terminal, deploy the AI Agent Marketplace contracts:

```bash
yarn deploy
```

This command deploys the smart contracts to the local network:
- `AI_Agent_Marketplace.sol` - Main marketplace contract for listing and buying agents
- `AI_Agent_NFT.sol` - NFT contract for AI agents

The contracts are located in `packages/hardhat/contracts` and the deploy scripts are in `packages/hardhat/deploy`.

### 4. Start Frontend Application

In a third terminal, start the NextJS frontend:

```bash
yarn start
```

Visit your app at: `http://localhost:3000`

You can now:
- 🎨 **Mint AI Agents**: Go to `/sell` to create new AI agent NFTs
- 🛒 **Browse Marketplace**: Visit `/marketplace` to see listed agents
- 🔧 **Debug Contracts**: Use the `Debug Contracts` page to interact with smart contracts directly

### 5. Set Up The Graph (Optional but Recommended)

For efficient querying of marketplace data, set up The Graph integration:

#### Prerequisites
- Ensure Docker is running on your system

#### Clean and Start Graph Node

```bash
# Clean any old data (run this if you need to reset)
yarn subgraph:clean-node

# Start the graph node
yarn subgraph:run-node
```

**Keep this terminal running!** The Graph node needs to stay active.

#### Deploy Subgraph

In a new terminal:

```bash
# Create the subgraph
yarn subgraph:create-local

# Deploy the subgraph
yarn subgraph:deploy-local
```

## 📁 Project Structure

```
ai-agent-marketplace/
├── packages/
│   ├── hardhat/          # Smart contracts and deployment scripts
│   │   ├── contracts/    # Solidity contracts
│   │   ├── deploy/       # Deployment scripts
│   │   └── test/         # Contract tests
│   ├── nextjs/           # Frontend application
│   │   ├── app/          # Next.js app router pages
│   │   ├── components/   # React components
│   │   └── services/     # Web3 services and utilities
│   └── subgraph/         # The Graph configuration
│       ├── src/          # Subgraph mappings
│       └── abis/         # Contract ABIs
```

## 🧪 Development Commands

### Smart Contract Development

```bash
# Run contract tests
yarn hardhat:test

# Verify contracts
yarn verify

# Generate TypeScript types from contracts
yarn generate
```

### Frontend Development

```bash
# Start development server
yarn start

# Build for production
yarn build

# Lint code
yarn lint
```

### The Graph Development

```bash
# Generate subgraph code
yarn subgraph:codegen

# Build subgraph
yarn subgraph:build

# Clean subgraph data
yarn subgraph:clean-node
```

## 🎯 Usage Guide

### Creating AI Agents

1. Navigate to `/sell`
2. Fill in agent details:
   - Model name (e.g., "GPT-4", "Claude-3")
   - Capabilities (comma-separated)
   - License type
   - Price in ETH
3. Click "Create & List Agent"
4. Confirm the transaction in your wallet

### Buying AI Agents

1. Navigate to `/marketplace`
2. Browse available agents
3. Click "Buy" on desired agent
4. Confirm purchase transaction
5. Agent NFT will be transferred to your wallet

### Managing Your Collection

- View owned agents in wallet or block explorer
- Re-list agents for sale through the marketplace
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contracts in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`

## 🚀 Setup The Graph Integration

Now that we have spun up our blockchain, started our frontend application and deployed our smart contract, we can start setting up our subgraph and utilize The Graph!

> Before following these steps be sure Docker is running!

#### ✅ Step 1: Clean up any old data and spin up our docker containers ✅

First run the following to clean up any old data. Do this if you need to reset everything.

```
yarn subgraph:clean-node
```

> We can now spin up a graph node by running the following command… 🧑‍🚀

```
yarn subgraph:run-node
```

This will spin up all the containers for The Graph using docker-compose. You will want to keep this window open at all times so that you can see log output from Docker.

> As stated before, be sure to keep this window open so that you can see any log output from Docker. 🔎

> NOTE FOR LINUX USERS: If you are running Linux you will need some additional changes to the project.

##### Linux Only

### Managing Your Collection

- View owned agents in wallet or block explorer
- Re-list agents for sale through the marketplace

## 🛠 Troubleshooting

### Common Issues

1. **"Marketplace not deployed in mapping"**
   - Ensure you've run `yarn deploy` after starting `yarn chain`
   - Check that the contracts are deployed to the correct network

2. **Subgraph not syncing**
   - Restart the graph node: `yarn subgraph:clean-node` then `yarn subgraph:run-node`
   - Redeploy the subgraph: `yarn subgraph:deploy-local`

3. **Frontend not connecting to wallet**
   - Make sure your wallet is connected to the local network (usually localhost:8545)
   - Import the local account private keys if needed

4. **Docker issues with The Graph**
   - Ensure Docker is running and has sufficient resources
   - On Windows, make sure Docker Desktop is running
   - Try restarting Docker if containers fail to start

### Useful Development Tips

- Use the **Debug Contracts** page to test contract functions directly
- Check browser console for detailed error messages
- Use `yarn hardhat:test` to run contract tests before deployment
- Monitor the terminal running `yarn chain` for transaction logs

## 📚 Learn More

- [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
- [Hardhat Documentation](https://hardhat.org/docs)
- [The Graph Documentation](https://thegraph.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

```
"chain": "hardhat node --network hardhat --no-deploy --hostname 0.0.0.0"
```

**For foundry**

Update your package.json in packages/foundry with the following command line option for the anvil chain.

```
"chain": "anvil --host 0.0.0.0 --config-out localhost.json",
```

Save the file and then restart your chain in its original window.

```
yarn chain
```

Redeploy your smart contracts.

```
yarn deploy
```

You might also need to add a firewall exception for port 8432. As an example for Ubuntu... run the following command.

```
sudo ufw allow 8545/tcp
```

#### ✅ Step 2: Create and ship our subgraph ✅

Now we can open up a fifth window to finish setting up The Graph. 😅 In this fifth window we will create our local subgraph!

> Note: You will only need to do this once.

```
yarn subgraph:create-local
```

> You should see some output stating your subgraph has been created along with a log output on your graph-node inside docker.

Next we will ship our subgraph! You will need to give your subgraph a version after executing this command. (e.g. 0.0.1).

```
yarn subgraph:local-ship
```

> This command does the following all in one… 🚀🚀🚀

-   Copies the contracts ABI from the hardhat/deployments folder
-   Generates the networks.json file
-   Generates AssemblyScript types from the subgraph schema and the contract ABIs.
-   Compiles and checks the mapping functions.
-   … and deploy a local subgraph!

> If you get an error ts-node you can install it with the following command

```
npm install -g ts-node
```

You should get a build completed output along with the address of your Subgraph endpoint.

```
Build completed: QmYdGWsVSUYTd1dJnqn84kJkDggc2GD9RZWK5xLVEMB9iP

Deployed to http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql

Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/scaffold-eth/your-contract
```

#### ✅ Step 3: Test your Subgraph ✅

Go ahead and head over to your subgraph endpoint and take a look!

> Here is an example query…

```
  {
    greetings(first: 25, orderBy: createdAt, orderDirection: desc) {
      id
      greeting
      premium
      This monorepo bootstraps a Scaffold-ETH 2 dApp for a C2C AI Agent Marketplace. Contracts are managed with Hardhat, the frontend is Next.js, and The Graph powers indexing.

      ## Polygon Amoy (Testnet)

        - `yarn chain` (new terminal)
        - `yarn deploy`

      ## Polygon Amoy (Testnet)

      Hardhat is configured with `polygonAmoy` (chainId 80002).

      Deploy:

      ```
      yarn deploy --network polygonAmoy
      ```

      Verify (optional):

      ```
      yarn hardhat:verify --network polygonAmoy <address> [constructor args]
      ```

      Frontend: enable Amoy by setting `targetNetworks` in `packages/nextjs/scaffold.config.ts` (already added). Provide `NEXT_PUBLIC_ALCHEMY_API_KEY` for RPC.

      value
      createdAt
      sender {
        address
        greetingCount
      }
    }
  }
```

> If all is well and you’ve sent a transaction to your smart contract then you will see a similar data output!

#### ✅ Step 4: Create Graph Client Artifacts ✅

The Graph Client is a tool used to query GraphQL based applications and contains a lot of advanced features, such as client side composition or automatic pagination. A complete list of features and goals of this project can be found [here].(https://github.com/graphprotocol/graph-client?tab=readme-ov-file#features-and-goals)

In order to utilize Graph-Client in our application, we need to build the artifacts needed for our frontend. To do this simply run...

```
yarn graphclient:build
```

After doing so, navigate to http://localhost:3000/subgraph and you should be able to see the GraphQL rendered in your application. If you don't see anything, make sure you've triggered an event in your smart contract.

If you want to look at the query code for this, it can be found the component located in the subgraph folder `packages/nextjs/app/subgraph/_components/GreetingsTable.tsx`



#### ✅ Side Quest: Run a Matchstick Test ✅

Matchstick is a [unit testing framework](https://thegraph.com/docs/en/developing/unit-testing-framework/), developed by [LimeChain](https://limechain.tech/), that enables subgraph developers to test their mapping logic in a sandboxed environment and deploy their subgraphs with confidence!

The project comes with a pre-written test located in `packages/subgraph/tests/asserts.test.ts`

To test simply type....

```
yarn subgraph:test
```

> This will run `graph test` and automatically download the needed files for testing.

You should receive the following output.

```
Fetching latest version tag...
Downloading release from https://github.com/LimeChain/matchstick/releases/download/0.6.0/binary-macos-11-m1
binary-macos-11-m1 has been installed!

Compiling...

💬 Compiling asserts...

Igniting tests 🔥

asserts
--------------------------------------------------
  Asserts:
    √ Greeting and Sender entities - 0.102ms

All 1 tests passed! 😎

[Thu, 07 Mar 2024 15:10:26 -0800] Program executed in: 1.838s.
```

> NOTE: If you get an error, you may trying passing `-d` flag `yarn subgraph:test -d`. This will run matchstick in docker container.

## Shipping to Subgraph Studio 🚀

> NOTE: This step requires [deployment of contract](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts) to live network. Checkout list of [supported networks](https://thegraph.com/docs/networks).

1. Update the `packages/subgraph/subgraph.yaml` file with your contract address, network name, start block number(optional) :
   ```diff
   ...
   -     network: localhost
   +     network: sepolia
         source:
           abi: YourContract
   +       address: "0x54FE7f8Db97e102D3b7d86cc34D885B735E31E8e"
   +       startBlock: 5889410
   ...
   ```
  TIP: For `startBlock` you can use block number of your deployed contract, which can be found by visiting deployed transaction hash in blockexplorer.

2. Create a new subgraph on [Subgraph Studio](https://thegraph.com/studio) and get "SUBGRAPH SLUG" and "DEPLOY KEY".

3. Authenticate with the graph CLI:
   ```sh
   yarn graph auth --studio <DEPLOY KEY>
   ```

4. Deploy the subgraph to TheGraph Studio:
   ```sh
   yarn graph deploy --studio <SUBGRAPH SLUG>
   ```
   Once deployed, the CLI should output the Subgraph endpoints. Copy the HTTP endpoint and test your queries.

5. Update `packages/nextjs/components/ScaffoldEthAppWithProviders.tsx` to use the above HTTP subgraph endpoint:
   ```diff
   - const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
   + const subgraphUri = 'YOUR_SUBGRAPH_ENDPOINT';
   ```

## A list of all available root commands

### graph

```sh
yarn graph
```

Shortcut to run `@graphprotocol/graph-cli` scoped to the subgraph package.

### run-node

```sh
yarn subgraph:run-node
```

Spin up a local graph node (requires Docker).

### stop-node

```sh
yarn subgraph:stop-node
```

Stop the local graph node.

### clean-node

```sh
yarn clean-node
```

Remove the data from the local graph node.

### local-create

```sh
yarn subgraph:create-local
```

Create your local subgraph (only required once).

### local-remove

```sh
yarn subgraph:remove-local
```

Delete a local subgprah.

### abi-copy

```sh
yarn subgraph:abi-copy
```

Copy the contracts ABI from the hardhat/deployments folder. Generates the networks.json file too.

### codegen

```sh
yarn subgraph:codegen
```

Generates AssemblyScript types from the subgraph schema and the contract ABIs.

### build

```sh
yarn subgraph:build
```

Compile and check the mapping functions.

### local-deploy

```sh
yarn subgraph:deploy-local
```

Deploy a local subgraph.

### local-ship

```sh
yarn subgraph:local-ship
```

Run all the required commands to deploy a local subgraph (abi-copy, codegen, build and local-deploy).

### deploy

```sh
yarn subgraph:deploy
```

Deploy a subgraph to The Graph Network.
## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.