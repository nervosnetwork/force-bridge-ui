import { Asset, AssetPayload } from '../../base';

export class EthereumERC20 extends Asset {
  constructor(options: AssetPayload) {
    super({ ...options, network: 'Ethereum' });
  }

  copy(): EthereumERC20 {
    return new EthereumERC20({ ...this });
  }
}
