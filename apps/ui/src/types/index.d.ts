/// <reference types="./styled-components.d.ts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;

    REACT_APP_REPO_UI_URL: string;
    REACT_APP_REPO_UI_GIT_SHA: string;

    REACT_APP_BRIDGE_RPC_URL: string;
    REACT_APP_BRIDGE_BSC_RPC_URL: string;
    REACT_APP_CKB_RPC_URL: string;
    REACT_APP_CKB_CHAIN_ID: string;

    REACT_APP_PWLOCK_OUTPOINT_TXHASH: string;
    REACT_APP_PWLOCK_OUTPOINT_INDEX: string;
    REACT_APP_PWLOCK_DEP_TYPE: string;
    REACT_APP_PWLOCK_CODE_HASH: string;
    REACT_APP_PWLOCK_HASH_TYPE: string;

    REACT_APP_TX_EXPLORER_NERVOS: string;
    REACT_APP_TX_EXPLORER_ETHEREUM: string;
    REACT_APP_TX_EXPLORER_BSC: string;
    REACT_APP_ETHEREUM_ENABLE_CHAIN_ID: string;
    REACT_APP_ETHEREUM_ENABLE_CHAIN_NAME: string;
    REACT_APP_BSC_ENABLE_CHAIN_ID: string;
    REACT_APP_BSC_ENABLE_CHAIN_NAME: string;
    REACT_APP_BSC_RPC_URL: string;
  }
}
