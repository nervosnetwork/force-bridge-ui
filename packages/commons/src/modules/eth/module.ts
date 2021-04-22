import { EthereumNetwork, Module } from '../../types';
import { EthereumAssetModel } from './AssetModel';
import { ETHEREUM_NETWORK } from './constants';

export const EthereumModule: Module<EthereumNetwork> = {
  network: ETHEREUM_NETWORK,
  assetModel: EthereumAssetModel,
};
