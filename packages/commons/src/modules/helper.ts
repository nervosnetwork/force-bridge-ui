import isEqual from 'lodash.isequal';
import { boom } from '../errors';
import { AssetType, NetworkTypes, RequiredAsset } from '../types';
import { AssetModel } from '../types/module';

// typescript helper function
export function createAssetPredicate<T>(
  pred: (x: AssetType) => boolean,
): <X extends AssetType>(asset: X) => asset is X & T {
  if (typeof pred !== 'function') boom('param of `createAssetPredicate` must be a function');
  return pred as <X>(asset: X) => asset is T & X;
}

type Options<T extends NetworkTypes> = {
  network: T['Network'];

  // prettier-ignore
  createFungibleAsset?: <X extends AssetType>(options: X) => RequiredAsset<'amount'> & X;
  //prettier-ignore
  createNativeAsset?: <X extends AssetType>(options: X) => RequiredAsset<'amount'> & X;

  // isCurrentNetworkAsset: <X extends AssetLike>(asset: X) => asset is AssetLike<T> & X;
  isCurrentNetworkAsset?: (asset: AssetType) => boolean;

  // check if two assets are the same asset
  equalsFungibleAsset?: <X extends AssetType, Y extends AssetType>(x: X, y: Y) => boolean;
  // identity of an asset, e.g. address of an ERC20
  identity?: <X extends AssetType>(asset: X) => string;
  // check an asset is native asset of the network or not
  // isNativeAsset: <X extends AssetLike>(asset: X) => asset is NativeAsset<T> & X;
  isNativeAsset: (asset: AssetType) => boolean;
  // check an asset is derived from an network or not
  // isDerivedAsset: <X extends AssetLike>(asset: X) => asset is FungibleAsset<T> & X;
  isDerivedAsset: (asset: AssetType) => boolean;
};

export function createAssetModel<T extends NetworkTypes>(options: Options<T>): AssetModel<T> {
  // required options
  const { network, isNativeAsset, isDerivedAsset } = options;

  const {
    identity = (asset) => `${network}/${asset.ident}`,
    // prettier-ignore
    equalsFungibleAsset = (assetA, assetB) => assetA.network === network && assetB.network === network && isEqual(assetA.ident, assetB.ident),
    createFungibleAsset = (assetLike) => ({ amount: '0', ...assetLike }),
    createNativeAsset = (assetLike) => ({ amount: '0', ...assetLike }),
    isCurrentNetworkAsset = (asset) => asset.network === network && (isNativeAsset(asset) || isDerivedAsset(asset)),
  } = options;

  return {
    network,
    createNativeAsset,
    createFungibleAsset,
    identity,
    equalsFungibleAsset,

    isCurrentNetworkAsset: createAssetPredicate<AssetType>(isCurrentNetworkAsset),
    isNativeAsset: createAssetPredicate<AssetType>(isNativeAsset),
    isDerivedAsset: createAssetPredicate<AssetType>(isDerivedAsset),
  };
}

const HEX_REGEX = /^0[xX][0-9a-fA-F]*$/;

export function isValidHexStr(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  return HEX_REGEX.test(str);
}
