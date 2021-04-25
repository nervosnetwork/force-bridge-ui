import { FungibleBaseInfo } from '../../../types';
import { Asset } from '../../base';

type Options = {
  shadow?: Asset;
  amount?: string;
  info?: FungibleBaseInfo;
};

export class EthereumEther extends Asset {
  constructor(options: Options) {
    super({ ...options, ident: '0x0000000000000000000000000000000000000000', isNative: true, network: 'Ethereum' });
  }

  copy(): EthereumEther {
    return new EthereumEther({ ...this });
  }
}
