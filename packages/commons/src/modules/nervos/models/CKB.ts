import { NATIVE_CKB_ADDRESS, NERVOS_NETWORK } from '../../../constatns';
import { FungibleBaseInfo } from '../../../types';
import { Asset } from '../../base';

type Options = {
  shadow?: Asset;
  amount?: string;
  info?: FungibleBaseInfo;
  isNervosNative?: boolean;
};

export class CKB extends Asset {
  constructor(options: Options) {
    super({ ...options, ident: NATIVE_CKB_ADDRESS, isNative: true, network: NERVOS_NETWORK });
  }

  copy(): CKB {
    return new CKB({ ...this });
  }
}
