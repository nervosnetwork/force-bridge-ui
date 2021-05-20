import { NervosNetwork, NetworkBase } from '@force-bridge/commons';
import { unimplemented } from 'errors';
import { AbstractWalletSigner } from 'interfaces/WalletConnector/AbstractWalletSigner';

export class DummyWalletSigner extends AbstractWalletSigner<NetworkBase> {
  constructor(nervosIdent: string, xchainIdent: string, private _nervosRPCURL: string, private _xchainRPCURL: string) {
    super(nervosIdent, xchainIdent);
  }

  _isNervosTransaction(
    raw: NetworkBase['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is NervosNetwork['RawTransaction'] {
    return false;
  }

  _isXChainTransaction(
    raw: NetworkBase['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is NetworkBase['RawTransaction'] {
    return false;
  }

  _sendToNervos(raw: NervosNetwork['RawTransaction']): Promise<{ txId: string }> {
    console.log('send transaction to Nervos: ' + this._nervosRPCURL);
    unimplemented();
  }

  _sendToXChain(raw: NetworkBase['RawTransaction']): Promise<{ txId: string }> {
    console.log('send transaction to XChain: ' + this._xchainRPCURL);
    unimplemented();
  }
}
