import { EthereumNetwork } from '../../types';
import { createAssetModel, isValidHexStr } from '../helper';
import { ETHEREUM_NETWORK, NATIVE_ETHER_ADDRESS } from './constants';

export const EthereumAssetModel = createAssetModel<EthereumNetwork>({
  network: ETHEREUM_NETWORK,

  createNativeAsset(assetLike) {
    return { amount: '0', ...assetLike, network: ETHEREUM_NETWORK, ident: NATIVE_ETHER_ADDRESS };
  },

  identity(asset) {
    return asset.ident;
  },

  isDerivedAsset: (asset) =>
    // prettier-ignore
    asset.network === ETHEREUM_NETWORK &&
    isValidHexStr(asset.ident) &&
    asset.ident !== NATIVE_ETHER_ADDRESS,

  isNativeAsset: (asset) => asset.network === ETHEREUM_NETWORK && asset.ident === NATIVE_ETHER_ADDRESS,
});
