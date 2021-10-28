# Force Bridge User Interface

## Quick Start

### Requirement

- NodeJS 12+
- yarn 1.x

```
git clone path/to/the/force-bridge-ui
cd force-bridge-ui
yarn install
# build commons libraries
yarn build:lib
yarn workspace @force-bridge/ui run start
```

## Build the User Interface

### Create .env

Create an `.env.local` at [apps/ui/](apps/ui) to declare required environment variables, the below env config shows how
force-bridge-ui works with Rinkeby network and Ethereum network

<details>
  <summary>Testnet</summary>

```
# Force-Bridge RPC
REACT_APP_BRIDGE_RPC_URL=/api/force-bridge/api/v1
# CKB node RPC
REACT_APP_CKB_RPC_URL=//aggron.ckb.dev/rpc

# Nervos explorer for exploring transaction
REACT_APP_TX_EXPLORER_NERVOS=https://explorer.nervos.org/aggron/transaction/
# Ethereum explorer for exploring transaction
REACT_APP_TX_EXPLORER_ETHEREUM=https://rinkeby.etherscan.io/tx/

# 0: mainnet
# 1: testnet
# 2: devnet
REACT_APP_CKB_CHAIN_ID=1

# Rinkeby
REACT_APP_ETHEREUM_ENABLE_CHAIN_ID=4
REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME=Rinkeby

# Godwoken
REACT_APP_GODWOKEN_ETH_LOCKHASH=0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22
REACT_APP_GODWOKEN_ROLLUP_TYPEHASH=0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a
```

</details>

<details>
  <summary>Mainnet</summary>

```
# Force-Bridge RPC
REACT_APP_BRIDGE_RPC_URL=/api/force-bridge/api/v1
# CKB node RPC
REACT_APP_CKB_RPC_URL=//lina.ckb.dev/rpc

# Nervos explorer for exploring transaction
REACT_APP_TX_EXPLORER_NERVOS=https://explorer.nervos.org/transaction/
# Ethereum explorer for exploring transaction
REACT_APP_TX_EXPLORER_ETHEREUM=https://etherscan.io/tx/

# 0: mainnet
# 1: testnet
# 2: devnet
REACT_APP_CKB_CHAIN_ID=0

# Mainnet
REACT_APP_ETHEREUM_ENABLE_CHAIN_ID=1
REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME=Ethereum

# Godwoken
REACT_APP_GODWOKEN_ETH_LOCKHASH=
REACT_APP_GODWOKEN_ROLLUP_TYPEHASH=
```

</details>

### Run Command To Build

```
> pwd
/path/to/force-bridge-ui
> yarn install
> yarn run build:lib

> cd apps/ui
> yarn run build
```

We will get a `build` folder after the build. The `build/index.html` is the program entry, and we should serve
the `build` folder with an HTTP server.

For more about deployment, we can check this [doc](https://create-react-app.dev/docs/deployment)
