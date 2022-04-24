import { NERVOS_NETWORK, NATIVE_CKB_ADDRESS } from '../../constatns';
import { NervosNetwork } from '../../types';
import { createAssetModel, isValidHexStr } from '../helper';

export const NervosAssetModel = createAssetModel<NervosNetwork>({
  network: NERVOS_NETWORK,

  isDerivedAsset: (asset) =>
    asset.network === NERVOS_NETWORK && isValidHexStr(asset.ident) && asset.ident !== NATIVE_CKB_ADDRESS,

  isNativeAsset: (asset) => asset.network === NERVOS_NETWORK && asset.ident === NATIVE_CKB_ADDRESS,
});
