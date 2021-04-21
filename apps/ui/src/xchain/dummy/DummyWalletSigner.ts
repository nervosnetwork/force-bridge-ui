import { NervosNetwork, NetworkBase } from '@force-bridge/commons';
import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';
import { unimplemented } from 'interfaces/errors';

export class DummyWalletSigner extends AbstractWalletSigner<NetworkBase> {
  _isNervosTransaction(raw: unknown): raw is NervosNetwork['RawTransaction'] {
    return false;
  }

  _isOriginTransaction(raw: unknown): raw is NetworkBase['RawTransaction'] {
    return false;
  }

  _signNervos(raw: NervosNetwork['RawTransaction']): NervosNetwork['SignedTransaction'] {
    unimplemented();
  }

  _signOrigin(raw: NetworkBase['RawTransaction']): NetworkBase['SignedTransaction'] {
    unimplemented();
  }

  identityNervos(): string {
    return 'ckt1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  }

  identityOrigin(): string {
    return '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  }
}
