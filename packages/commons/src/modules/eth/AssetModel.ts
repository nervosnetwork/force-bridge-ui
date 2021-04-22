import { EthereumNetwork } from '../../types';
import { hasProp } from '../../utils';
import { createAssetModel } from '../helper';
import { ETHEREUM_NETWORK, NATIVE_ETHER_ADDRESS } from './constants';

export const EthereumAssetModel = createAssetModel<EthereumNetwork>({
  network: ETHEREUM_NETWORK,

  createNativeAsset({ amount = '0' }) {
    return { network: ETHEREUM_NETWORK, ident: { address: NATIVE_ETHER_ADDRESS }, amount };
  },

  identity(asset) {
    return asset.ident.address;
  },

  isDerivedAsset: (asset) =>
    asset.network === ETHEREUM_NETWORK &&
    hasProp(asset.ident, 'address') &&
    asset.ident.address !== NATIVE_ETHER_ADDRESS,

  isNativeAsset: (asset) =>
    asset.network === ETHEREUM_NETWORK &&
    hasProp(asset.ident, 'address') &&
    asset.ident.address === NATIVE_ETHER_ADDRESS,
});
