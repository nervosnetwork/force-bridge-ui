import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils';
import { NERVOS_NETWORK } from '../../constatns';
import { NervosNetwork } from '../../types';
import { hasProp, propEq } from '../../utils';
import { createAssetModel, isValidHexStr } from '../helper';

export const NervosAssetModel = createAssetModel<NervosNetwork>({
  network: NERVOS_NETWORK,

  identity(asset) {
    if (!asset.ident) return 'ckb';
    return scriptToHash(asset.ident);
  },

  isNativeAsset(asset) {
    return propEq(asset, 'network', NERVOS_NETWORK) && asset.ident == null;
  },

  isDerivedAsset(asset) {
    // prettier-ignore
    return (
      propEq(asset, 'network', NERVOS_NETWORK) &&
      hasProp(asset.ident, 'args') && isValidHexStr(asset.ident.args) &&
      hasProp(asset.ident, 'codeHash') && isValidHexStr(asset.ident.codeHash) &&
      hasProp(asset.ident, 'hashType') && (asset.ident.hashType === 'data' || asset.ident.hashType === 'type')
    );
  },
});
