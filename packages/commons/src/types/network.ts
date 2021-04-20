// network types, all types arr plain JSON object

// types naming conventions:
// XIdent: the ident of the X resource, e.g. type ERC20Ident = { address: '0x...' }
// XInfo: the ident with network e.g. type type ERC20Info = { network: 'Ethereum', address: '0x...' }

import { SUDTType, UserLock } from './nervos';

export type NervosNetworkName = 'Nervos';

// number without decimals, e.g. 0x123aaa(Hex), 12547(Decimal)
// do NOT use such values like, 1.225, 0.22
export type AmountWithoutDecimals = string;

export type NetworkBase = {
  Network?: string;
  NativeAssetIdent?: unknown;
  // ident of an fungible derived from this network
  // e.g. Eth -> { address: string } / Nervos -> { type: Script }
  FungibleAssetIdent?: unknown;
  UserIdent?: unknown;

  RawTransaction?: unknown;
  SignedTransaction?: unknown;
};

type XChainShadow<NetworkName> = NetworkName extends NervosNetworkName ? unknown : { shadow: SUDTType };

export type FungibleInfo<T extends NetworkBase, IdKey extends keyof T> = {
  network: T['Network'];
  ident: T[IdKey];

  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
} & XChainShadow<T['Network']>;

export type NativeAsset<T extends NetworkBase = NetworkBase> = {
  network: T['Network'];
  ident: T['NativeAssetIdent'];
};

export type FungibleAsset<T extends NetworkBase = NetworkBase> = {
  network: T['Network'];
  ident: T['FungibleAssetIdent'];
};

export type AssetWithAmount<T extends NetworkBase, IdKey extends keyof T> = {
  network: T['Network'];
  amount: AmountWithoutDecimals;
  ident: T[IdKey];
};

export type NetworkTypes<T extends NetworkBase = NetworkBase> = Required<T> & {
  AssetIdent: T['FungibleAssetIdent'] | T['NativeAssetIdent'];

  UserInfo: { network: T['Network']; ident: T['UserIdent'] };

  FungibleInfo: FungibleInfo<T, 'FungibleAssetIdent'>;
  NativeInfo: FungibleInfo<T, 'NativeAssetIdent'>;
  AssetInfo: FungibleInfo<T, 'FungibleAssetIdent'> | FungibleInfo<T, 'NativeAssetIdent'>;

  NativeAssetWithAmount: AssetWithAmount<T, 'NativeAssetIdent'>;
  FungibleAssetWithAmount: AssetWithAmount<T, 'FungibleAssetIdent'>;
  AssetWithAmount: AssetWithAmount<T, 'NativeAssetIdent'> | AssetWithAmount<T, 'FungibleAssetIdent'>;
};

export type NervosNetwork = NetworkTypes<{
  Network: NervosNetworkName;
  NativeAssetIdent: undefined;
  FungibleAssetIdent: SUDTType;
  UserIdent: UserLock;
  // TODO
  RawTransaction: unknown;
  // TODO
  SignedTransaction: unknown;
}>;

export type EthereumNetwork = NetworkTypes<{
  Network: 'Ethereum';
  NativeAssetIdent: { address: '0x0000000000000000000000000000000000000000' };
  FungibleAssetIdent: { address: string };
  UserIdent: { address: string };
  // TODO
  RawTransaction: unknown;
  // TODO
  SignedTransaction: unknown;
}>;

export type AllNetworks = NervosNetwork | EthereumNetwork;
export type XChainNetwork = EthereumNetwork;
