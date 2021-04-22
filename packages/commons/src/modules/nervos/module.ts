import { NERVOS_NETWORK } from '../../constatns';
import { Module, NervosNetwork } from '../../types';
import { NervosAssetModel } from './AssetModel';

export const NervosModule: Module<NervosNetwork> = {
  network: NERVOS_NETWORK,
  assetModel: NervosAssetModel,
};
