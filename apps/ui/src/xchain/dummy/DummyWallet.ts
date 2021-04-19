import { DummyWalletSigner } from './DummyWalletSigner';
import { AbstractWalletConnector } from 'interfaces/WalletConnector';
import { unimplemented } from 'interfaces/errors';

const asyncSleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class DummyWallet extends AbstractWalletConnector {
  constructor() {
    super();
    console.log('waiting for connect');
  }

  _connect(): Promise<void> {
    asyncSleep(2000 * Math.random()).then(() =>
      super.changeSigner(new DummyWalletSigner(Math.random() + 'rand address')),
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
