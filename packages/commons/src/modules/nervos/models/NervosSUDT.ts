import { Asset, AssetPayload } from '../../base';

export class NervosSUDT extends Asset {
  constructor(options: AssetPayload) {
    super({ ...options, network: 'Nervos' });
  }
}
