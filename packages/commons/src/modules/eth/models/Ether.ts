import { FungibleBaseInfo } from '../../../types';
import { Asset } from '../../base';

type Options = {
  shadow?: Asset;
  amount?: string;
  info?: FungibleBaseInfo;
};

export class Ether extends Asset {
  constructor(options: Options) {
    super({ ...options, ident: '0x0000000000000000000000000000000000000000', isNative: true, network: 'Ethereum' });
  }

  copy(): Ether {
    return new Ether({ ...this });
  }
}
