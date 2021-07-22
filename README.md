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

Create an `.env.local` at [apps/ui/](apps/ui) to declare required environment variables

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

REACT_APP_ETHEREUM_LOCKER_CONTRACT=0x88631919037C4574C3142476E5e45DbD96C1BE36

```

### Run Command To Build

```
> pwd
/path/to/force-bridge-ui
> yarn install
> yarn run build:lib

> cd apps/ui
> yarn run build
```

We will get a `build` folder after the build. The `build/index.html` is the program entry, and we should serve the `build` folder with an HTTP server.

For more about deployment, we can check
this [doc](https://create-react-app.dev/docs/deployment)
