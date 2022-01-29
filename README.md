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
# craco start
yarn workspace @force-bridge/ui run start
# build ui
cd apps/ui
yarn build
# serve -s build
```

## Build the User Interface

### Create .env

Create an `.env.local` at [apps/ui/](apps/ui) to declare required environment variables, the below env config shows how
force-bridge-ui works with Rinkeby network and Bsc network

<details>
  <summary>Testnet</summary>

```
# Force-Bridge Ethereum Backend RPC
REACT_APP_BRIDGE_RPC_URL=/api/force-bridge/api/v1
# Force-Bridge Bsc Backend RPC
REACT_APP_BRIDGE_BSC_RPC_URL=

# CKB node RPC
REACT_APP_CKB_RPC_URL=https://testnet.ckbapp.dev/rpc

# 0: mainnet
# 1: testnet
# 2: devnet
REACT_APP_CKB_CHAIN_ID=1

# Nervos explorer for exploring transaction
REACT_APP_TX_EXPLORER_NERVOS=https://explorer.nervos.org/aggron/transaction/
# Ethereum explorer for exploring transaction
REACT_APP_TX_EXPLORER_ETHEREUM=https://rinkeby.etherscan.io/tx/
# Bsc explorer for exploring transaction
REACT_APP_TX_EXPLORER_BSC=https://testnet.bscscan.com/tx/

# Rinkeby
REACT_APP_ETHEREUM_ENABLE_CHAIN_ID=4
REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME=Rinkeby

# Bsc Testnet
REACT_APP_BSC_ENABLE_CHAIN_ID=97
REACT_APP_BSC_ENABLE_CHAIN_NAME=Bsc-Testnet
```

</details>

<details>
  <summary>Mainnet</summary>

```
# Force-Bridge Ethereum Backend RPC
REACT_APP_BRIDGE_RPC_URL=/api/force-bridge/api/v1
# Force-Bridge Bsc Backend RPC
REACT_APP_BRIDGE_BSC_RPC_URL=

# CKB node RPC
REACT_APP_CKB_RPC_URL=//lina.ckb.dev/rpc

# 0: mainnet
# 1: testnet
# 2: devnet
REACT_APP_CKB_CHAIN_ID=0

# Nervos explorer for exploring transaction
REACT_APP_TX_EXPLORER_NERVOS=https://explorer.nervos.org/transaction/
# Ethereum explorer for exploring transaction
REACT_APP_TX_EXPLORER_ETHEREUM=https://etherscan.io/tx/
# Bsc explorer for exploring transaction
REACT_APP_TX_EXPLORER_BSC=https://bscscan.com/tx/

# Ethereum Mainnet
REACT_APP_ETHEREUM_ENABLE_CHAIN_ID=1
REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME=Ethereum

# Bsc Mainnet
REACT_APP_BSC_ENABLE_CHAIN_ID=56
REACT_APP_BSC_ENABLE_CHAIN_NAME=Bsc-Mainnet
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
