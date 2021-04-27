import { Asset, AssetPayload } from '../../base';

export class SUDT extends Asset {
  constructor(options: AssetPayload) {
    super({ ...options, network: 'Nervos' });
  }

  copy(): Asset {
    return new SUDT({ ...this });
  }
}
