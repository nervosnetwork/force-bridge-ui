import { AssetModel, EthereumNetwork } from '../../types';
import { hasProp } from '../../utils';
import { createAssetPredicate } from '../helper';
import { ETHEREUM_NETWORK, NATIVE_ETHER_ADDRESS } from './constants';

export const EthereumAssetModel: AssetModel<EthereumNetwork> = {
  network: ETHEREUM_NETWORK,
  createFungibleAsset({ assetIdent, amount = '0' }) {
    return { amount, ident: assetIdent, network: ETHEREUM_NETWORK };
  },
  createNativeAsset({ amount = '0' }) {
    return { network: ETHEREUM_NETWORK, ident: { address: NATIVE_ETHER_ADDRESS }, amount };
  },
  equalsFungibleAsset(assetA, assetB) {
    return (
      assetA.network === assetB.network &&
      hasProp(assetA.ident, 'address') &&
      hasProp(assetB.ident, 'address') &&
      assetA.ident.address === assetB.ident.address
    );
  },
  identity(asset) {
    return asset.ident.address;
  },
  isDerivedAsset: createAssetPredicate<EthereumNetwork>(
    (asset) =>
      asset.network === ETHEREUM_NETWORK &&
      hasProp(asset.ident, 'address') &&
      asset.ident.address !== NATIVE_ETHER_ADDRESS,
  ),
  isNativeAsset: createAssetPredicate<EthereumNetwork>(
    (asset) =>
      asset.network === ETHEREUM_NETWORK &&
      hasProp(asset.ident, 'address') &&
      asset.ident.address === NATIVE_ETHER_ADDRESS,
  ),
};
