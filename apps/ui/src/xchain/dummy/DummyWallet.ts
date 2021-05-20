import { NetworkTypes } from '@force-bridge/commons';
import { DummyWalletSigner } from './DummyWalletSigner';
import { unimplemented } from 'errors';
import { AbstractWalletConnector } from 'interfaces/WalletConnector';

const asyncSleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class DummyWallet extends AbstractWalletConnector<NetworkTypes> {
  constructor() {
    super();
    console.log('waiting for connect');
  }

  _connect(): Promise<void> {
    asyncSleep(2000 * Math.random()).then(() =>
      super.changeSigner(
        new DummyWalletSigner(
          'ckt1ffffffffffffffffffffffffffffffffffffffff',
          '0xffffffffffffffffffffffffffffffffffffffff',
          'http://nervos-host-path:8114/rpc',
          'http://dummy-host-path:1111/rpc',
        ),
      ),
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
