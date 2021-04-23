import { AssetType, NetworkTypes, RequiredAsset } from './network';

type Promisifiable<T> = Promise<T> | T;

export interface Signer<Raw, Signed> {
  sign: (raw: Raw) => Promisifiable<Signed>;
}

export interface AssetModel<T extends NetworkTypes> {
  network: T['Network'];

  isCurrentNetworkAsset: (asset: AssetType) => boolean;

  // prettier-ignore
  createFungibleAsset: <X extends AssetType>(options: X) => RequiredAsset<'amount'> & X;
  //prettier-ignore
  createNativeAsset: <X extends AssetType>(options: X) => RequiredAsset<'amount'> & X;

  // check if two assets are the same asset
  equalsFungibleAsset: (x: AssetType, y: AssetType) => boolean;
  // identity of an asset, e.g. address of an ERC20
  identity: (asset: AssetType) => string;
  // check an asset is native asset of the network or not
  isNativeAsset: (asset: AssetType) => boolean;
  // check an asset is derived from an network or not
  isDerivedAsset: (asset: AssetType) => boolean;
}

export interface Module<M extends NetworkTypes = NetworkTypes> {
  network: M['Network'];
  assetModel: AssetModel<M>;
}
