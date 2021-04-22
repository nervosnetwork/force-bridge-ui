import { AmountWithoutDecimals, FungibleAsset, NativeAsset, NetworkTypes } from '@force-bridge/commons';
import isEqual from 'lodash.isequal';
import { boom } from '../errors';
import { AssetLike, AssetModel } from '../types/module';

// typescript helper function
export function createAssetPredicate<T>(pred: (x: AssetLike) => boolean): <X>(asset: X) => asset is T & X {
  if (typeof pred !== 'function') boom('param of `createAssetPredicate` must be a function');
  return pred as <X>(asset: X) => asset is T & X;
}

type Options<T extends NetworkTypes> = {
  network: T['Network'];

  // prettier-ignore
  createFungibleAsset?: (options: { amount?: AmountWithoutDecimals; assetIdent: T['FungibleAssetIdent']; }) => T['FungibleAssetWithAmount'];
  //prettier-ignore
  createNativeAsset?: (options: { amount?: AmountWithoutDecimals; assetIdent?: T['NativeAssetIdent']; }) => T['NativeAssetWithAmount'];

  // isCurrentNetworkAsset: <X extends AssetLike>(asset: X) => asset is AssetLike<T> & X;
  isCurrentNetworkAsset?: <X extends AssetLike>(asset: X) => boolean;

  // check if two assets are the same asset
  equalsFungibleAsset?: <X extends FungibleAsset<T>, Y extends FungibleAsset<T>>(x: X, y: Y) => boolean;
  // identity of an asset, e.g. address of an ERC20
  identity: <X extends FungibleAsset<T>>(asset: X) => string;
  // check an asset is native asset of the network or not
  // isNativeAsset: <X extends AssetLike>(asset: X) => asset is NativeAsset<T> & X;
  isNativeAsset: <X extends AssetLike>(asset: X) => boolean;
  // check an asset is derived from an network or not
  // isDerivedAsset: <X extends AssetLike>(asset: X) => asset is FungibleAsset<T> & X;
  isDerivedAsset: <X extends AssetLike>(asset: X) => boolean;
};

export function createAssetModel<T extends NetworkTypes>(options: Options<T>): AssetModel<T> {
  // required options
  const { network, identity } = options;

  const {
    // prettier-ignore
    equalsFungibleAsset = (assetA, assetB) => assetA.network === network && assetB.network === network && isEqual(assetA.ident, assetB.ident),
    createFungibleAsset = ({ amount = '0', assetIdent }) => ({ network, ident: assetIdent, amount }),
    createNativeAsset = ({ amount = '0', assetIdent }) => ({ network, ident: assetIdent, amount }),
  } = options;

  const isNativeAsset = createAssetPredicate<NativeAsset<T>>(options.isNativeAsset);
  const isDerivedAsset = createAssetPredicate<FungibleAsset<T>>(options.isDerivedAsset);
  const isCurrentNetworkAsset = createAssetPredicate<AssetLike<T>>((asset) => {
    if (asset.network !== network) return false;
    return isNativeAsset(asset) || isDerivedAsset(asset);
  });

  return {
    network,
    createNativeAsset,
    createFungibleAsset,
    identity,
    equalsFungibleAsset,

    isCurrentNetworkAsset,
    isNativeAsset,
    isDerivedAsset,
  };
}

const HEX_REGEX = /^0[xX][0-9a-fA-F]*$/;

export function isValidHexStr(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  return HEX_REGEX.test(str);
}
