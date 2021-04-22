import { AllNetworks, NervosNetwork, NetworkBase, NetworkTypes, XChainNetwork } from './network';

export enum BridgeTransactionStatus {
  Pending = 'Pending',
  Successful = 'Successful',
  Failed = 'Failed',
}

/* unix timestamp in milliseconds */
type Timestamp = number;
export type TransactionIdent = { txId: string };
export type TransactionSummary = {
  fromAsset: AllNetworks['FungibleAssetWithAmount'];
  toAsset: AllNetworks['FungibleAssetWithAmount'];
  fromTransaction: TransactionIdent & { timestamp?: Timestamp };
  toTransaction?: TransactionIdent & { timestamp?: Timestamp };
};
export type FailedTransactionSummary = TransactionSummary & { status: BridgeTransactionStatus.Failed; message: string };
export type UnFailedTransactionSummary = TransactionSummary & {
  status: BridgeTransactionStatus.Pending | BridgeTransactionStatus.Successful;
};

export type TransactionSummaryWithStatus = UnFailedTransactionSummary | FailedTransactionSummary;

// XChain -> Nervos
export type GenerateBridgeInTransactionPayload<N extends NetworkTypes> = {
  asset: N['AssetWithAmount'];
  recipient: NervosNetwork['UserIdent'];
  sender: N['UserIdent'];
};

// Nervos -> XChain
export type GenerateBridgeOutNervosTransactionPayload<N extends NetworkTypes> = {
  network: N['Network'];
  asset: NervosNetwork['FungibleAssetIdent'];
  recipient: N['UserIdent'];
  sender: NervosNetwork['UserIdent'];
};

export type GenerateTransactionResponse<N extends NetworkTypes> = {
  network: N['Network'];
  // TODO
  rawTransaction: N['RawTransaction'];
  bridgeFee: N['AssetWithAmount'];
};

export type SignedTransactionPayload<N extends NetworkBase> = {
  // TODO
  signedTransaction: N['SignedTransaction'];
  network: N['Network'];
};

export type GetBalancePayload<N extends NetworkTypes = NetworkTypes> = Array<{
  network: N['Network'];
  userIdent: N['UserIdent'];
  assetIdent: N['AssetIdent'];
}>;

export type GetBalanceResponse<N extends NetworkTypes = NetworkTypes> = {
  network: N['Network'];
  userIdent: N['UserIdent'];
  asset: N['AssetWithAmount'];
};

export type GetBridgeTransactionStatusPayload<N extends AllNetworks> = {
  network: N['Network'];
  txId: string;
};

export type GetBridgeTransactionSummariesPayload = {
  userIdent: NervosNetwork['UserIdent'];
  network: XChainNetwork['Network'];
};

export type GetBridgeTransactionStatusResponse<N extends AllNetworks> = {
  network: N['Network'];
  status: BridgeTransactionStatus;
};

// TODO: change to the higher order generic when it impl
// https://github.com/microsoft/TypeScript/issues/1213
export interface ForceBridgeAPIV1 {
  /* generate transaction */
  // prettier-ignore
  generateBridgeInNervosTransaction: <T extends NetworkTypes>(payload: GenerateBridgeInTransactionPayload<T>) => Promise<GenerateTransactionResponse<T>>
  // prettier-ignore
  generateBridgeOutNervosTransaction: <T extends NetworkTypes>(payload: GenerateBridgeOutNervosTransactionPayload<T>) => Promise<GenerateTransactionResponse<T>>

  /* send transaction */
  sendSignedTransaction: <T extends NetworkBase>(payload: SignedTransactionPayload<T>) => Promise<TransactionIdent>;

  /* get transaction summary */
  // prettier-ignore
  /**
   * get the status of a transaction
   */
  getBridgeTransactionStatus: (payload: GetBridgeTransactionStatusPayload<AllNetworks>) => Promise<GetBridgeTransactionStatusResponse<AllNetworks>>;
  // prettier-ignore
  getBridgeTransactionSummaries: (payload: GetBridgeTransactionSummariesPayload) => Promise<TransactionSummaryWithStatus[]>;

  // get an asset list, or if no `name` param is passed in, return a default list of whitelisted assets
  getAssetList: <X extends NetworkTypes>(name?: string) => Promise<X['AssetInfo'][]>;
  // get the user's balance, or if no `assets` param is passed in, return all whitelisted assets
  // prettier-ignore
  getBalance: <T extends NetworkTypes>(payload: GetBalancePayload<T>) => Promise<(GetBalanceResponse<T>)[]>;
}
