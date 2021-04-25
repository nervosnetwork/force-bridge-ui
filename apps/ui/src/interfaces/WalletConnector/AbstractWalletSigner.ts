import { NervosNetwork, NetworkBase } from '@force-bridge/commons';
import { TwoWaySigner } from './types';
import { boom, unimplemented } from 'interfaces/errors';

export abstract class AbstractWalletSigner<T extends NetworkBase> implements TwoWaySigner<T> {
  constructor(private _identNervos: NervosNetwork['UserIdent'], private _identOrigin: T['UserIdent']) {}

  async sign(
    raw: T['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): Promise<T['SignedTransaction'] | NervosNetwork['SignedTransaction']> {
    if (this._isNervosTransaction(raw)) return this._signNervos(raw);
    if (this._isOriginTransaction(raw)) return this._signOrigin(raw);

    boom(unimplemented);
  }

  identNervos(): NervosNetwork['UserIdent'] {
    return this._identNervos;
  }

  identOrigin(): T['UserIdent'] {
    return this._identOrigin;
  }

  // sign for origin network
  abstract _signOrigin(raw: T['RawTransaction']): Promise<T['SignedTransaction']>;

  // sign for nervos network
  abstract _signNervos(raw: NervosNetwork['RawTransaction']): Promise<NervosNetwork['SignedTransaction']>;

  // check if this RawTransaction is signed for origin network
  abstract _isOriginTransaction(raw: T['RawTransaction'] | NervosNetwork['RawTransaction']): raw is T['RawTransaction'];

  // check if this RawTransaction is signed for Nervos
  abstract _isNervosTransaction(
    raw: T['RawTransaction'] | NervosNetwork['RawTransaction'],
  ): raw is NervosNetwork['RawTransaction'];

  // current signer identity on Nervos
  abstract identityNervos(): string;

  // current signer identity on origin network
  abstract identityOrigin(): string;
}
