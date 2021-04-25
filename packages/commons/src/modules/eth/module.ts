import { EthereumNetwork, Module } from '../../types';
import { isValidHexStr } from '../helper';
import { EthereumAssetModel } from './AssetModel';
import { ETHEREUM_NETWORK } from './constants';

export const EthereumModule: Module<EthereumNetwork> = {
  network: ETHEREUM_NETWORK,
  assetModel: EthereumAssetModel,
  validators: {
    network: ETHEREUM_NETWORK,

    validateUserIdent(userIdent) {
      return isValidHexStr(userIdent) && userIdent.length === 42;
    },
  },

  bridgeFeeModel: {
    network: ETHEREUM_NETWORK,
    calcBridgeFee(asset) {
      // TODO
      return { ...asset, amount: '0' };
    },
  },
};
