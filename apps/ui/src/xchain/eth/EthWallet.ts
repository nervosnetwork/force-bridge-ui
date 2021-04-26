import { NetworkTypes } from '@force-bridge/commons';
import { EthWalletSigner } from './EthWalletSigner';
import { AbstractWalletConnector } from 'interfaces/WalletConnector';
import { unimplemented } from 'interfaces/errors';

const asyncSleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class EthWallet extends AbstractWalletConnector<NetworkTypes> {
  constructor() {
    super();
    console.log('waiting for connect');
  }

  _connect(): Promise<void> {
    asyncSleep(2000 * Math.random()).then(() =>
      super.changeSigner(
        new EthWalletSigner(
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
