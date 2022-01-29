import { HashType } from '@ckb-lumos/lumos';
import { NervosNetwork, NetworkBase, NetworkTypes, RequiredAsset } from './network';

export enum BridgeTransactionStatus {
  Pending = 'Pending',
  Successful = 'Successful',
  Failed = 'Failed',
}

/* unix timestamp in milliseconds */
type Timestamp = number;
export type TransactionIdent = { txId: string };
export type TransactionSummary = {
  txSummary: {
    fromAsset: RequiredAsset<'amount'>;
    toAsset: RequiredAsset<'amount'>;
    fromTransaction: TransactionIdent & { timestamp: Timestamp } & { confirmStatus: 'pending' | number | 'confirmed' };
    toTransaction?: TransactionIdent & { timestamp?: Timestamp };
  };
};
export type FailedTransactionSummary = TransactionSummary & { status: BridgeTransactionStatus.Failed; message: string };
export type UnFailedTransactionSummary = TransactionSummary & {
  status: BridgeTransactionStatus.Pending | BridgeTransactionStatus.Successful;
};

export type TransactionSummaryWithStatus = UnFailedTransactionSummary | FailedTransactionSummary;

// XChain -> Nervos
export type GenerateBridgeInTransactionPayload = {
  asset: RequiredAsset<'amount'>;
  recipient: NervosNetwork['UserIdent'];
  // XChain user ident
  sender: string;
};

// Nervos -> XChain
export type GenerateBridgeOutNervosTransactionPayload = {
  // XChain network name
  network: string;
  // XChain asset id
  // TODO refactor key to assetIdent
  asset: string;
  amount: string;
  // XChain User ident
  recipient: string;
  sender: NervosNetwork['UserIdent'];
};

export type GenerateTransactionResponse<N extends NetworkTypes> = {
  network: string;
  // TODO
  rawTransaction: N['RawTransaction'];
};

export type SignedTransactionPayload<N extends NetworkBase> = {
  network: N['Network'];
  // TODO
  signedTransaction: N['SignedTransaction'];
};

export type GetBalancePayload = Array<{
  network: string;
  userIdent: string;
  assetIdent: string;
}>;

export type GetBalanceResponse = Array<RequiredAsset<'amount'>>;

export type GetBridgeTransactionStatusPayload = {
  network: string;
  txId: string;
};

export type GetBridgeTransactionSummariesPayload = {
  network: string;
  xchainAssetIdent: string;
  user: {
    network: string;
    ident: string;
  };
};

export type GetBridgeTransactionStatusResponse = {
  network: string;
  status: BridgeTransactionStatus;
};

export interface GetMinimalBridgeAmountPayload {
  network: string;
  xchainAssetIdent: string;
}

export interface GetMinimalBridgeAmountResponse {
  minimalAmount: string;
}

export interface GetBridgeInNervosBridgeFeePayload {
  network: string;
  xchainAssetIdent: string;
  amount: string;
}

export interface GetBridgeInNervosBridgeFeeResponse {
  fee: RequiredAsset<'amount'>;
}

export interface GetBridgeOutNervosBridgeFeePayload {
  network: string;
  xchainAssetIdent: string;
  amount: string;
}

export interface GetBridgeOutNervosBridgeFeeResponse {
  fee: RequiredAsset<'amount'>;
}

export interface EthereumConfig {
  contractAddress: string;
  confirmNumber: number;
}

export interface GetConfigResponse {
  nervos: {
    network: 'mainnet' | 'testnet';
    confirmNumber: number;
    omniLockCodeHash: string;
    omniLockHashType: HashType;
  };
  xchains: {
    Ethereum: EthereumConfig;
  };
}

// TODO: change to the higher order generic when it impl
// https://github.com/microsoft/TypeScript/issues/1213
export interface ForceBridgeAPIV1 {
  /* generate transaction */
  // prettier-ignore
  generateBridgeInNervosTransaction: <T extends NetworkTypes>(payload: GenerateBridgeInTransactionPayload) => Promise<GenerateTransactionResponse<T>>;
  // prettier-ignore
  generateBridgeOutNervosTransaction: <T extends NetworkTypes>(payload: GenerateBridgeOutNervosTransactionPayload) => Promise<GenerateTransactionResponse<T>>;

  /* send transaction */
  sendSignedTransaction: <T extends NetworkBase>(payload: SignedTransactionPayload<T>) => Promise<TransactionIdent>;

  /* get transaction summary */
  // prettier-ignore
  /**
   * get the status of a transaction
   */
  getBridgeTransactionStatus: (payload: GetBridgeTransactionStatusPayload) => Promise<GetBridgeTransactionStatusResponse>;
  // prettier-ignore
  getBridgeTransactionSummaries: (payload: GetBridgeTransactionSummariesPayload) => Promise<TransactionSummaryWithStatus[]>;

  // get an asset list, or if no `name` param is passed in, return a default list of whitelisted assets
  getAssetList: (name?: string) => Promise<RequiredAsset<'info'>[]>;
  // get the user's balance, or if no `assets` param is passed in, return all whitelisted assets
  // prettier-ignore
  getBalance: (payload: GetBalancePayload) => Promise<GetBalanceResponse>;

  // prettier-ignore
  getMinimalBridgeAmount: (payload: GetMinimalBridgeAmountPayload) => Promise<GetMinimalBridgeAmountResponse>;

  // prettier-ignore
  getBridgeInNervosBridgeFee: (payload: GetBridgeInNervosBridgeFeePayload) => Promise<GetBridgeInNervosBridgeFeeResponse>;
  // prettier-ignore
  getBridgeOutNervosBridgeFee: (payload: GetBridgeOutNervosBridgeFeePayload) => Promise<GetBridgeOutNervosBridgeFeeResponse>;

  getBridgeConfig: () => Promise<GetConfigResponse>;
}
