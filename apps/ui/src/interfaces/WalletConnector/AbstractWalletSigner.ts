import { NervosNetwork, NetworkBase } from '@force-bridge/commons';
import { TwoWaySigner } from './types';
import { boom, unimplemented } from 'errors';

export abstract class AbstractWalletSigner<T extends NetworkBase> implements TwoWaySigner<T> {
  protected constructor(private _identNervos: NervosNetwork['UserIdent'], private _identXChain: T['UserIdent']) {}

  async sendTransaction(raw: T['RawTransaction'] | NervosNetwork['RawTransaction']): Promise<{ txId: string }> {
    if (this._isNervosTransaction(raw)) return this._sendToNervos(raw);
    if (this._isXChainTransaction(raw)) return this._sendToXChain(raw);

    boom(unimplemented);
  }

  // current signer identity on Nervos
  identityNervos(): string {
    return this._identNervos;
  }

  // current signer identity on origin network
  identityXChain(): string {
    return this._identXChain;
  }

  // sign for origin network
  abstract _sendToXChain(raw: T['RawTransaction']): Promise<{ txId: string }>;

  // sign for nervos network
  abstract _sendToNervos(raw: NervosNetwork['RawTransaction']): Promise<{ txId: string }>;

  // check if this RawTransaction is signed for origin network
  abstract _isXChainTransaction(raw: T['RawTransaction'] | NervosNetwork['RawTransaction']): raw is T['RawTransaction'];

  // check if this RawTransaction is signed for Nervos
  abstract _isNervosTransaction(
    raw: T['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is NervosNetwork['RawTransaction'];
}
