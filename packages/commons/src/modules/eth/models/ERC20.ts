import { Asset, AssetPayload } from '../../base';

export class ERC20 extends Asset {
  constructor(options: AssetPayload) {
    super({ ...options, network: 'Ethereum' });
  }

  copy(): ERC20 {
    return new ERC20({ ...this });
  }
}
