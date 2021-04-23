import { NERVOS_NETWORK } from '../../constatns';
import { NervosNetwork } from '../../types';
import { propEq } from '../../utils';
import { createAssetModel } from '../helper';

export const NervosAssetModel = createAssetModel<NervosNetwork>({
  network: NERVOS_NETWORK,

  isNativeAsset(asset) {
    return propEq(asset, 'network', NERVOS_NETWORK) && asset.ident == null;
  },

  isDerivedAsset(asset) {
    return propEq(asset, 'network', NERVOS_NETWORK);
  },
});
