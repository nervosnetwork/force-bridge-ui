declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;

    REACT_APP_BRIDGE_RPC_URL: string;
    REACT_APP_CKB_RPC_URL: string;

    REACT_APP_TX_EXPLORER_NERVOS: string;
    REACT_APP_TX_EXPLORER_ETHEREUM: string;
  }
}
