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
  <summary>Rinkeby network</summary>

```
# Force-Bridge RPC
REACT_APP_BRIDGE_RPC_URL=
# CKB node RPC
REACT_APP_CKB_RPC_URL=

# Nervos explorer for exploring transaction
REACT_APP_TX_EXPLORER_NERVOS=https://explorer.nervos.org/aggron/transaction/
# Ethereum explorer for exploring transaction
REACT_APP_TX_EXPLORER_ETHEREUM=https://rinkeby.etherscan.io/tx/

# Rinkeby
REACT_APP_ETHEREUM_ENABLE_CHAIN_ID=4
REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME=Rinkeby
```

</details>

<details>
  <summary>Ethereum network</summary>

```
# Force-Bridge RPC
REACT_APP_BRIDGE_RPC_URL=
# CKB node RPC
REACT_APP_CKB_RPC_URL=

# Nervos explorer for exploring transaction
REACT_APP_TX_EXPLORER_NERVOS=https://explorer.nervos.org/transaction/
# Ethereum explorer for exploring transaction
REACT_APP_TX_EXPLORER_ETHEREUM=https://etherscan.io/tx/

# Rinkeby
REACT_APP_ETHEREUM_ENABLE_CHAIN_ID=1
REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME=Ethereum
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
