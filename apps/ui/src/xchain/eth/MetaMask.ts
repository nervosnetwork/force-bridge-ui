import { NetworkTypes } from '@force-bridge/commons';
import { MetaMaskSigner } from './MetaMaskSigner';
import { AbstractWalletConnector } from 'interfaces/WalletConnector';
import { unimplemented } from 'interfaces/errors';

const asyncSleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MetaMask extends AbstractWalletConnector<NetworkTypes> {
  constructor() {
    super();
    console.log('waiting for connect');
  }

  _connect(): Promise<void> {
    asyncSleep(2000 * Math.random()).then(() =>
      super.changeSigner(new MetaMaskSigner({ codeHash: '0x', hashType: 'type', args: '0x' }, { address: '0x' })),
    );
    return Promise.resolve(undefined);
  }

  _disconnect(): Promise<void> {
    return Promise.resolve(undefined);
  }

  connectSilent(): void {
    unimplemented();
  }
}
