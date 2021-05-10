import { parseAddress } from '@nervosnetwork/ckb-sdk-utils';
import { NERVOS_NETWORK } from '../../constatns';
import { Module, NervosNetwork } from '../../types';
import { NervosAssetModel } from './AssetModel';

export const NervosModule: Module<NervosNetwork> = {
  network: NERVOS_NETWORK,
  assetModel: NervosAssetModel,
  bridgeFeeModel: {
    network: NERVOS_NETWORK,
    calcBridgeFee(asset) {
      // TODO
      return { ...asset, amount: '0' };
    },
  },

  validators: {
    network: NERVOS_NETWORK,
    validateUserIdent: (address) => {
      try {
        parseAddress(address);
        return true;
      } catch {
        return false;
      }
    },
  },
};
